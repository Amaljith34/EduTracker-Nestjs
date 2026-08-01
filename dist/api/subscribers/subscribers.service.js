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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_repository_1 = require("../../database/repositories/user.repository");
const review_repository_1 = require("../../database/repositories/review.repository");
const transaction_repository_1 = require("../../database/repositories/transaction.repository");
const helperFunction_utils_1 = require("../../helpers/helperFunction.utils");
const user_uniqueness_helper_1 = require("../../helpers/user-uniqueness.helper");
const auth_type_1 = require("../auth/auth.type");
const types_1 = require("../../database/types");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const user_schema_1 = require("../../database/schema/user.schema");
let SubscribersService = class SubscribersService {
    constructor(userModel, userRepository, reviewRepository, transactionRepository) {
        this.userModel = userModel;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.transactionRepository = transactionRepository;
    }
    async create(authUser, dto) {
        const { softDeletedMatch } = await (0, user_uniqueness_helper_1.assertEmailPhoneAvailable)(this.userModel, {
            email: dto.email,
            phone: dto.phone,
            creatingType: auth_type_1.UserType.SUBSCRIBER,
        });
        const hashedPassword = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        if (softDeletedMatch &&
            softDeletedMatch.type === auth_type_1.UserType.SUBSCRIBER &&
            softDeletedMatch.email === dto.email.trim().toLowerCase()) {
            const restored = await this.userRepository.updateById(softDeletedMatch._id.toString(), {
                fullName: dto.fullName,
                phone: dto.phone,
                password: hashedPassword,
                type: auth_type_1.UserType.SUBSCRIBER,
                status: types_1.DBStatus.ACTIVE,
                subjects: [],
                createdBy: new mongoose_2.Types.ObjectId(authUser.userId),
            });
            return this.sanitize(restored);
        }
        const subscriber = await this.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            password: hashedPassword,
            type: auth_type_1.UserType.SUBSCRIBER,
            status: types_1.DBStatus.ACTIVE,
            subjects: [],
            pendingAmount: 0,
            createdBy: new mongoose_2.Types.ObjectId(authUser.userId),
        });
        return this.sanitize(subscriber);
    }
    async findAll(query) {
        const filter = {
            type: auth_type_1.UserType.SUBSCRIBER,
            status: { $ne: types_1.DBStatus.DELETED },
        };
        if (query.status) {
            filter.status = query.status;
        }
        const result = await this.userRepository.findPaginated(filter, query, query.search);
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
        const subscriberFilter = {
            subscriberId: new mongoose_2.Types.ObjectId(id),
            status: { $ne: types_1.RecordStatus.DELETED },
        };
        const [reviewsResult, transactionsResult, reviewSum, txnSum, reviewCount, users] = await Promise.all([
            this.reviewRepository.findPaginated(subscriberFilter, { page: 1, limit: 100 }),
            this.transactionRepository.findPaginated(subscriberFilter, { page: 1, limit: 100 }),
            this.reviewRepository.aggregateSum(subscriberFilter),
            this.transactionRepository.aggregateSum(subscriberFilter),
            this.reviewRepository.getModel().countDocuments(subscriberFilter),
            this.userRepository.findEndUsersBySubscriber(id),
        ]);
        const totalReviewAmount = reviewSum[0]?.total ?? 0;
        const totalPaid = txnSum[0]?.total ?? 0;
        const pendingAmount = Number((totalReviewAmount - totalPaid).toFixed(2));
        const subjectMap = new Map();
        for (const review of reviewsResult.data) {
            const name = review.subjectName;
            const entry = subjectMap.get(name) || {
                subjectName: name,
                userCount: 0,
                totalAmount: 0,
            };
            entry.totalAmount += review.finalAmount || 0;
            subjectMap.set(name, entry);
        }
        for (const user of users) {
            for (const s of user.subjects || []) {
                const entry = subjectMap.get(s.subjectName) || {
                    subjectName: s.subjectName,
                    userCount: 0,
                    totalAmount: 0,
                };
                entry.userCount += 1;
                subjectMap.set(s.subjectName, entry);
            }
        }
        return {
            subscriber: this.sanitize(subscriber),
            reviews: reviewsResult.data,
            transactions: transactionsResult.data,
            subjects: Array.from(subjectMap.values()),
            summary: {
                totalReviews: reviewCount,
                totalReviewAmount,
                totalAmount: totalReviewAmount,
                totalPaid,
                pendingAmount: Math.max(0, pendingAmount),
                remainingBalance: Math.max(0, pendingAmount),
            },
        };
    }
    async update(id, dto) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        if (dto.email || dto.phone) {
            await (0, user_uniqueness_helper_1.assertEmailPhoneAvailable)(this.userModel, {
                email: dto.email ?? subscriber.email,
                phone: dto.phone ?? subscriber.phone,
                excludeId: id,
                creatingType: auth_type_1.UserType.SUBSCRIBER,
            });
        }
        const update = { ...dto };
        if (dto.password) {
            update.password = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
        }
        const updated = await this.userRepository.updateById(id, update);
        return this.sanitize(updated);
    }
    async setStatus(id, status) {
        const subscriber = await this.userRepository.findById(id);
        if (!subscriber || subscriber.type !== auth_type_1.UserType.SUBSCRIBER) {
            throw new common_1.NotFoundException('Subscriber not found');
        }
        const updated = await this.userRepository.updateById(id, { status });
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
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_repository_1.UserRepository,
        review_repository_1.ReviewRepository,
        transaction_repository_1.TransactionRepository])
], SubscribersService);
//# sourceMappingURL=subscribers.service.js.map