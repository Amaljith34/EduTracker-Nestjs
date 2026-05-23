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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const user_repository_1 = require("../../database/repositories/user.repository");
const review_repository_1 = require("../../database/repositories/review.repository");
const transaction_repository_1 = require("../../database/repositories/transaction.repository");
const helperFunction_utils_1 = require("../../helpers/helperFunction.utils");
const auth_type_1 = require("../auth/auth.type");
const types_1 = require("../../database/types");
const pagination_helper_1 = require("../../helpers/pagination.helper");
let UsersService = class UsersService {
    constructor(userRepository, reviewRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.transactionRepository = transactionRepository;
    }
    async create(authUser, dto) {
        let subscriberId = authUser.userId;
        if (authUser.type === auth_type_1.UserType.ADMIN) {
            if (!dto.subscriberId) {
                throw new common_1.ForbiddenException('subscriberId required for admin');
            }
            subscriberId = dto.subscriberId;
        }
        else if (authUser.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.ForbiddenException('Only subscribers or admins can create users');
        }
        const hashedPassword = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        const user = await this.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
            type: auth_type_1.UserType.USER,
            subscriberId: new mongoose_1.Types.ObjectId(subscriberId),
            subjects: dto.subjects ?? [],
            status: types_1.DBStatus.ACTIVE,
            createdBy: new mongoose_1.Types.ObjectId(authUser.userId),
        });
        return this.sanitize(user);
    }
    async findAll(authUser, query) {
        const filter = {
            type: auth_type_1.UserType.USER,
            status: { $ne: types_1.DBStatus.DELETED },
        };
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER) {
            filter.subscriberId = new mongoose_1.Types.ObjectId(authUser.userId);
        }
        else if (authUser.type === auth_type_1.UserType.ADMIN && query.subscriberId) {
            filter.subscriberId = new mongoose_1.Types.ObjectId(query.subscriberId);
        }
        const result = await this.userRepository.findPaginated(filter, query, query.search);
        return (0, pagination_helper_1.paginated)(result.data.map((u) => this.sanitize(u)), result.total, result.page, result.limit);
    }
    async findOne(authUser, id) {
        const user = await this.userRepository.findById(id);
        if (!user || user.type !== auth_type_1.UserType.USER) {
            throw new common_1.NotFoundException('User not found');
        }
        this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());
        const userFilter = { userId: new mongoose_1.Types.ObjectId(id) };
        const [reviewSum, txnSum, reviews, transactions] = await Promise.all([
            this.reviewRepository.aggregateSum(userFilter),
            this.transactionRepository.aggregateSum(userFilter),
            this.reviewRepository.findPaginated(userFilter, { page: 1, limit: 50 }),
            this.transactionRepository.findPaginated(userFilter, { page: 1, limit: 50 }),
        ]);
        const totalReviewAmount = reviewSum[0]?.total ?? 0;
        const totalPaid = txnSum[0]?.total ?? 0;
        return {
            user: this.sanitize(user),
            reviews: reviews.data,
            transactions: transactions.data,
            summary: {
                totalReviewAmount,
                totalPaid,
                remainingBalance: Number((totalReviewAmount - totalPaid).toFixed(2)),
            },
        };
    }
    async update(authUser, id, dto) {
        const user = await this.userRepository.findById(id);
        if (!user || user.type !== auth_type_1.UserType.USER) {
            throw new common_1.NotFoundException('User not found');
        }
        this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());
        const update = { ...dto };
        if (dto.password) {
            update.password = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        }
        const updated = await this.userRepository.updateById(id, update);
        return this.sanitize(updated);
    }
    async remove(authUser, id) {
        const user = await this.userRepository.findById(id);
        if (!user || user.type !== auth_type_1.UserType.USER) {
            throw new common_1.NotFoundException('User not found');
        }
        this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());
        await this.userRepository.softDelete(id);
        return { message: 'User deleted' };
    }
    assertAccess(authUser, subscriberId, userId) {
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return;
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER && authUser.userId === subscriberId) {
            return;
        }
        if (authUser.type === auth_type_1.UserType.USER && authUser.userId === userId) {
            return;
        }
        throw new common_1.ForbiddenException('Access denied');
    }
    sanitize(user) {
        const obj = user.toObject();
        delete obj.password;
        delete obj.refreshToken;
        return obj;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        review_repository_1.ReviewRepository,
        transaction_repository_1.TransactionRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map