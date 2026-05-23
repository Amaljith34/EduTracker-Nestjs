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
exports.SubscribersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const user_repository_1 = require("../../database/repositories/user.repository");
const review_repository_1 = require("../../database/repositories/review.repository");
const transaction_repository_1 = require("../../database/repositories/transaction.repository");
const helperFunction_utils_1 = require("../../helpers/helperFunction.utils");
const auth_type_1 = require("../auth/auth.type");
const types_1 = require("../../database/types");
const pagination_helper_1 = require("../../helpers/pagination.helper");
let SubscribersService = class SubscribersService {
    constructor(userRepository, reviewRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.transactionRepository = transactionRepository;
    }
    async create(authUser, dto) {
        const hashedPassword = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        const subscriber = await this.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
            type: auth_type_1.UserType.SUBSCRIBER,
            status: types_1.DBStatus.ACTIVE,
            subjects: [],
            createdBy: new mongoose_1.Types.ObjectId(authUser.userId),
        });
        return this.sanitize(subscriber);
    }
    async findAll(query) {
        const result = await this.userRepository.findPaginated({ type: auth_type_1.UserType.SUBSCRIBER, status: { $ne: types_1.DBStatus.DELETED } }, query, query.search);
        return (0, pagination_helper_1.paginated)(result.data.map((s) => this.sanitize(s)), result.total, result.page, result.limit);
    }
    async findOne(id) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        return this.sanitize(subscriber);
    }
    async findDetails(id) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        const subscriberFilter = { subscriberId: new mongoose_1.Types.ObjectId(id) };
        const [reviewsResult, transactionsResult, reviewSum, txnSum] = await Promise.all([
            this.reviewRepository.findPaginated(subscriberFilter, { page: 1, limit: 100 }),
            this.transactionRepository.findPaginated(subscriberFilter, { page: 1, limit: 100 }),
            this.reviewRepository.aggregateSum(subscriberFilter),
            this.transactionRepository.aggregateSum(subscriberFilter),
        ]);
        const totalReviewAmount = reviewSum[0]?.total ?? 0;
        const totalPaid = txnSum[0]?.total ?? 0;
        return {
            subscriber: this.sanitize(subscriber),
            reviews: reviewsResult.data,
            transactions: transactionsResult.data,
            summary: {
                totalReviewAmount,
                totalPaid,
                remainingBalance: Number((totalReviewAmount - totalPaid).toFixed(2)),
            },
        };
    }
    async update(id, dto) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        const update = { ...dto };
        if (dto.password) {
            update.password = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        }
        const updated = await this.userRepository.updateById(id, update);
        return this.sanitize(updated);
    }
    async remove(id) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        await this.userRepository.softDelete(id);
        return { message: 'Subscriber deleted' };
    }
    sanitize(user) {
        const obj = user.toObject();
        delete obj.password;
        delete obj.refreshToken;
        return {
            ...obj,
            id: obj._id?.toString(),
        };
    }
};
exports.SubscribersService = SubscribersService;
exports.SubscribersService = SubscribersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        review_repository_1.ReviewRepository,
        transaction_repository_1.TransactionRepository])
], SubscribersService);
//# sourceMappingURL=subscribers.service.js.map