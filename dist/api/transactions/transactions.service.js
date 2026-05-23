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
const user_repository_1 = require("../../database/repositories/user.repository");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const auth_type_1 = require("../auth/auth.type");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    buildScopeFilter(authUser) {
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return {};
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER) {
            return { subscriberId: new mongoose_1.Types.ObjectId(authUser.userId) };
        }
        return { userId: new mongoose_1.Types.ObjectId(authUser.userId) };
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
        return this.transactionRepository.create({
            userId: new mongoose_1.Types.ObjectId(dto.userId),
            subscriberId: new mongoose_1.Types.ObjectId(subscriberId),
            amountPaid: dto.amountPaid,
            paymentDate: new Date(dto.paymentDate),
            notes: dto.notes,
        });
    }
    async findAll(authUser, query) {
        const filter = this.buildScopeFilter(authUser);
        const result = await this.transactionRepository.findPaginated(filter, query);
        return (0, pagination_helper_1.paginated)(result.data, result.total, result.page, result.limit);
    }
    async update(authUser, id, dto) {
        const txn = await this.transactionRepository.findById(id);
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        this.assertAccess(authUser, txn);
        if (dto.amountPaid !== undefined)
            txn.amountPaid = dto.amountPaid;
        if (dto.paymentDate)
            txn.paymentDate = new Date(dto.paymentDate);
        if (dto.notes !== undefined)
            txn.notes = dto.notes;
        return this.transactionRepository.save(txn);
    }
    async remove(authUser, id) {
        const txn = await this.transactionRepository.findById(id);
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        this.assertAccess(authUser, txn);
        await this.transactionRepository.remove(txn);
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
        user_repository_1.UserRepository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map