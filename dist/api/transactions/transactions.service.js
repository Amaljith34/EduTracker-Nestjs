"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const transaction_repository_1 = require("../../database/repositories/transaction.repository");
const review_repository_1 = require("../../database/repositories/review.repository");
const user_repository_1 = require("../../database/repositories/user.repository");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const auth_type_1 = require("../auth/auth.type");
const types_1 = require("../../database/types");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, reviewRepository, userRepository) {
        this.transactionRepository = transactionRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }
    buildScopeFilter(authUser) {
        const base = {
            status: { $ne: types_1.RecordStatus.DELETED },
        };
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return base;
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER) {
            return { ...base, subscriberId: new mongoose_1.Types.ObjectId(authUser.userId) };
        }
        return { ...base, userId: new mongoose_1.Types.ObjectId(authUser.userId) };
    }
    async getUserBalance(userId, subscriberId) {
        const filter = {
            userId: new mongoose_1.Types.ObjectId(userId),
            subscriberId: new mongoose_1.Types.ObjectId(subscriberId),
            status: { $ne: types_1.RecordStatus.DELETED },
        };
        const [reviewSum, txnSum] = await Promise.all([
            this.reviewRepository.aggregateSum(filter),
            this.transactionRepository.aggregateSum(filter),
        ]);
        const totalReviewAmount = reviewSum[0]?.total ?? 0;
        const totalPaid = txnSum[0]?.total ?? 0;
        const pendingAmount = Math.max(0, Number((totalReviewAmount - totalPaid).toFixed(2)));
        return { totalReviewAmount, totalPaid, pendingAmount };
    }
    async create(authUser, dto) {
        if (authUser.type === auth_type_1.UserType.USER) {
            throw new common_1.ForbiddenException('Users cannot create transactions');
        }
        const endUser = await this.userRepository.findById(dto.userId);
        if (!endUser || endUser.type !== auth_type_1.UserType.USER) {
            throw new common_1.NotFoundException('User not found');
        }
        const subscriberId = authUser.type === auth_type_1.UserType.ADMIN
            ? endUser.subscriberId?.toString()
            : authUser.userId;
        if (!subscriberId || endUser.subscriberId?.toString() !== subscriberId) {
            throw new common_1.ForbiddenException('User does not belong to this subscriber');
        }
        const balance = await this.getUserBalance(dto.userId, subscriberId);
        if (dto.amountPaid > balance.pendingAmount) {
            throw new common_1.BadRequestException(`Payment amount (₹${dto.amountPaid}) exceeds pending balance (₹${balance.pendingAmount})`);
        }
        const txn = await this.transactionRepository.create({
            userId: new mongoose_1.Types.ObjectId(dto.userId),
            subscriberId: new mongoose_1.Types.ObjectId(subscriberId),
            amountPaid: dto.amountPaid,
            paymentDate: new Date(dto.paymentDate),
            notes: dto.notes,
            status: types_1.RecordStatus.APPROVED,
        });
        const pendingAmount = Math.max(0, Number(((endUser.pendingAmount || balance.pendingAmount) - dto.amountPaid).toFixed(2)));
        await this.userRepository.updateById(dto.userId, { pendingAmount });
        return {
            ...txn.toObject(),
            balance: {
                ...balance,
                pendingAmount,
            },
        };
    }
    async findAll(authUser, query) {
        const filter = this.buildScopeFilter(authUser);
        const result = await this.transactionRepository.findPaginated(filter, query);
        return (0, pagination_helper_1.paginated)(result.data, result.total, result.page, result.limit);
    }
    async getBalanceForUser(authUser, userId) {
        const endUser = await this.userRepository.findById(userId);
        if (!endUser || endUser.type !== auth_type_1.UserType.USER) {
            throw new common_1.NotFoundException('User not found');
        }
        const subscriberId = authUser.type === auth_type_1.UserType.ADMIN
            ? endUser.subscriberId?.toString()
            : authUser.type === auth_type_1.UserType.SUBSCRIBER
                ? authUser.userId
                : endUser.subscriberId?.toString();
        if (!subscriberId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER &&
            endUser.subscriberId?.toString() !== authUser.userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.getUserBalance(userId, subscriberId);
    }
    async update(authUser, id, dto) {
        const txn = await this.transactionRepository.findById(id);
        if (!txn || txn.status === types_1.RecordStatus.DELETED) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        this.assertAccess(authUser, txn);
        const previousAmount = txn.amountPaid;
        if (dto.amountPaid !== undefined) {
            const balance = await this.getUserBalance(txn.userId.toString(), txn.subscriberId.toString());
            const available = balance.pendingAmount + previousAmount;
            if (dto.amountPaid > available) {
                throw new common_1.BadRequestException(`Payment amount (₹${dto.amountPaid}) exceeds pending balance (₹${available})`);
            }
            txn.amountPaid = dto.amountPaid;
        }
        if (dto.paymentDate)
            txn.paymentDate = new Date(dto.paymentDate);
        if (dto.notes !== undefined)
            txn.notes = dto.notes;
        if (dto.status)
            txn.status = dto.status;
        const saved = await this.transactionRepository.save(txn);
        if (dto.amountPaid !== undefined && dto.amountPaid !== previousAmount) {
            const endUser = await this.userRepository.findById(txn.userId.toString());
            if (endUser) {
                const delta = dto.amountPaid - previousAmount;
                const pendingAmount = Math.max(0, Number(((endUser.pendingAmount || 0) - delta).toFixed(2)));
                await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
            }
        }
        return saved;
    }
    async remove(authUser, id) {
        const txn = await this.transactionRepository.findById(id);
        if (!txn || txn.status === types_1.RecordStatus.DELETED) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        this.assertAccess(authUser, txn);
        txn.status = types_1.RecordStatus.DELETED;
        await this.transactionRepository.save(txn);
        const endUser = await this.userRepository.findById(txn.userId.toString());
        if (endUser) {
            const pendingAmount = Number(((endUser.pendingAmount || 0) + txn.amountPaid).toFixed(2));
            await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
        }
        return { message: 'Transaction deleted' };
    }
    assertAccess(authUser, txn) {
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return;
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER &&
            txn.subscriberId.toString() === authUser.userId) {
            return;
        }
        throw new common_1.ForbiddenException('Access denied');
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_1.TransactionRepository,
        review_repository_1.ReviewRepository,
        user_repository_1.UserRepository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map