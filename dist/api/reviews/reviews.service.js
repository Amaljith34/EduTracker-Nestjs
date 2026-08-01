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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const review_repository_1 = require("../../database/repositories/review.repository");
const user_repository_1 = require("../../database/repositories/user.repository");
const review_calculator_helper_1 = require("../../helpers/review-calculator.helper");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const auth_type_1 = require("../auth/auth.type");
const types_1 = require("../../database/types");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, userRepository) {
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
    async create(authUser, dto) {
        if (authUser.type === auth_type_1.UserType.USER) {
            throw new common_1.ForbiddenException('Users cannot create reviews');
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
        const subject = endUser.subjects?.find((s) => s.subjectName === dto.subjectName);
        if (!subject) {
            throw new common_1.NotFoundException('Subject not found on user');
        }
        const calculatedAmount = (0, review_calculator_helper_1.calculateReviewAmount)(subject.amountPerHour, dto.hours);
        const finalAmount = dto.finalAmount ?? calculatedAmount;
        const review = await this.reviewRepository.create({
            userId: new mongoose_1.Types.ObjectId(dto.userId),
            subscriberId: new mongoose_1.Types.ObjectId(subscriberId),
            subjectName: dto.subjectName,
            amountPerHour: subject.amountPerHour,
            hours: dto.hours,
            calculatedAmount,
            finalAmount,
            date: new Date(dto.date),
            notes: dto.notes,
            status: types_1.RecordStatus.APPROVED,
        });
        const pendingAmount = Number(((endUser.pendingAmount || 0) + finalAmount).toFixed(2));
        await this.userRepository.updateById(dto.userId, { pendingAmount });
        return review;
    }
    async findAll(authUser, query) {
        const filter = this.buildScopeFilter(authUser);
        const result = await this.reviewRepository.findPaginated(filter, query);
        return (0, pagination_helper_1.paginated)(result.data, result.total, result.page, result.limit);
    }
    async update(authUser, id, dto) {
        const review = await this.reviewRepository.findById(id);
        if (!review || review.status === types_1.RecordStatus.DELETED) {
            throw new common_1.NotFoundException('Review not found');
        }
        this.assertReviewAccess(authUser, review);
        const previousAmount = review.finalAmount;
        if (dto.subjectName || dto.hours !== undefined) {
            const endUser = await this.userRepository.findById(review.userId.toString());
            const subjectName = dto.subjectName ?? review.subjectName;
            const hours = dto.hours ?? review.hours;
            const subject = endUser?.subjects?.find((s) => s.subjectName === subjectName);
            if (!subject)
                throw new common_1.NotFoundException('Subject not found');
            review.subjectName = subjectName;
            review.amountPerHour = subject.amountPerHour;
            review.hours = hours;
            review.calculatedAmount = (0, review_calculator_helper_1.calculateReviewAmount)(subject.amountPerHour, hours);
            review.finalAmount = dto.finalAmount ?? review.calculatedAmount;
        }
        else if (dto.finalAmount !== undefined) {
            review.finalAmount = dto.finalAmount;
        }
        if (dto.date)
            review.date = new Date(dto.date);
        if (dto.notes !== undefined)
            review.notes = dto.notes;
        if (dto.status)
            review.status = dto.status;
        const saved = await this.reviewRepository.save(review);
        const delta = saved.finalAmount - previousAmount;
        if (delta !== 0) {
            const endUser = await this.userRepository.findById(review.userId.toString());
            if (endUser) {
                const pendingAmount = Math.max(0, Number(((endUser.pendingAmount || 0) + delta).toFixed(2)));
                await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
            }
        }
        return saved;
    }
    async remove(authUser, id) {
        const review = await this.reviewRepository.findById(id);
        if (!review || review.status === types_1.RecordStatus.DELETED) {
            throw new common_1.NotFoundException('Review not found');
        }
        this.assertReviewAccess(authUser, review);
        review.status = types_1.RecordStatus.DELETED;
        await this.reviewRepository.save(review);
        const endUser = await this.userRepository.findById(review.userId.toString());
        if (endUser) {
            const pendingAmount = Math.max(0, Number(((endUser.pendingAmount || 0) - review.finalAmount).toFixed(2)));
            await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
        }
        return { message: 'Review deleted' };
    }
    assertReviewAccess(authUser, review) {
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return;
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER &&
            review.subscriberId.toString() === authUser.userId) {
            return;
        }
        throw new common_1.ForbiddenException('Access denied');
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository,
        user_repository_1.UserRepository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map