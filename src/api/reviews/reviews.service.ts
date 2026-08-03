import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { calculateReviewAmount } from 'src/helpers/review-calculator.helper';
import { paginated } from 'src/helpers/pagination.helper';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
import { RecordStatus } from 'src/database/types';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private buildScopeFilter(authUser: AuthUserPayload): Record<string, unknown> {
    const base: Record<string, unknown> = {
      status: { $ne: RecordStatus.DELETED },
    };
    if (authUser.type === UserType.ADMIN) return base;
    if (authUser.type === UserType.SUBSCRIBER) {
      return { ...base, subscriberId: new Types.ObjectId(authUser.userId) };
    }
    return { ...base, userId: new Types.ObjectId(authUser.userId) };
  }

  async create(authUser: AuthUserPayload, dto: CreateReviewDto) {
    if (authUser.type === UserType.USER) {
      throw new ForbiddenException('Users cannot create reviews');
    }

    const endUser = await this.userRepository.findById(dto.userId);
    if (!endUser || endUser.type !== UserType.USER) {
      throw new NotFoundException('User not found');
    }

    const subscriberId =
      authUser.type === UserType.ADMIN
        ? endUser.subscriberId?.toString()
        : authUser.userId;

    if (!subscriberId || endUser.subscriberId?.toString() !== subscriberId) {
      throw new ForbiddenException('User does not belong to this subscriber');
    }

    const subject = endUser.subjects?.find((s) => s.subjectName === dto.subjectName);
    if (!subject) {
      throw new NotFoundException('Subject not found on user');
    }

    const calculatedAmount = calculateReviewAmount(subject.amountPerHour, dto.hours);
    const finalAmount = dto.finalAmount ?? calculatedAmount;

    const review = await this.reviewRepository.create({
      userId: new Types.ObjectId(dto.userId),
      subscriberId: new Types.ObjectId(subscriberId),
      subjectName: dto.subjectName,
      amountPerHour: subject.amountPerHour,
      hours: dto.hours,
      calculatedAmount,
      finalAmount,
      date: new Date(dto.date),
      notes: dto.notes,
      status: RecordStatus.APPROVED,
    });

    const pendingAmount = Number(
      ((endUser.pendingAmount || 0) + finalAmount).toFixed(2),
    );
    await this.userRepository.updateById(dto.userId, { pendingAmount });

    return review;
  }

  async findAll(authUser: AuthUserPayload, query: FilterReviewDto) {
    const filter = this.buildScopeFilter(authUser);
    const result = await this.reviewRepository.findPaginated(filter, query);
    
    // Calculate thisMonthCount
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Use the same base query but override the date range to "this month"
    // We ignore the pagination and just count.
    const countResult = await this.reviewRepository.findPaginated(
      filter, 
      { ...query, page: 1, limit: 1, fromDate: thisMonthStart.toISOString(), toDate: thisMonthEnd.toISOString(), period: undefined }
    );

    const response = paginated(result.data, result.total, result.page, result.limit);
    return { ...response, thisMonthCount: countResult.total };
  }

  async update(authUser: AuthUserPayload, id: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepository.findById(id);
    if (!review || review.status === RecordStatus.DELETED) {
      throw new NotFoundException('Review not found');
    }
    this.assertReviewAccess(authUser, review);

    const previousAmount = review.finalAmount;

    if (dto.subjectName || dto.hours !== undefined) {
      const endUser = await this.userRepository.findById(review.userId.toString());
      const subjectName = dto.subjectName ?? review.subjectName;
      const hours = dto.hours ?? review.hours;
      const subject = endUser?.subjects?.find((s) => s.subjectName === subjectName);
      if (!subject) throw new NotFoundException('Subject not found');

      review.subjectName = subjectName;
      review.amountPerHour = subject.amountPerHour;
      review.hours = hours;
      review.calculatedAmount = calculateReviewAmount(subject.amountPerHour, hours);
      review.finalAmount = dto.finalAmount ?? review.calculatedAmount;
    } else if (dto.finalAmount !== undefined) {
      review.finalAmount = dto.finalAmount;
    }

    if (dto.date) review.date = new Date(dto.date);
    if (dto.notes !== undefined) review.notes = dto.notes;
    if (dto.status) review.status = dto.status;

    const saved = await this.reviewRepository.save(review);

    const delta = saved.finalAmount - previousAmount;
    if (delta !== 0) {
      const endUser = await this.userRepository.findById(review.userId.toString());
      if (endUser) {
        const pendingAmount = Math.max(
          0,
          Number(((endUser.pendingAmount || 0) + delta).toFixed(2)),
        );
        await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
      }
    }

    return saved;
  }

  async remove(authUser: AuthUserPayload, id: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review || review.status === RecordStatus.DELETED) {
      throw new NotFoundException('Review not found');
    }
    this.assertReviewAccess(authUser, review);

    review.status = RecordStatus.DELETED;
    await this.reviewRepository.save(review);

    const endUser = await this.userRepository.findById(review.userId.toString());
    if (endUser) {
      const pendingAmount = Math.max(
        0,
        Number(((endUser.pendingAmount || 0) - review.finalAmount).toFixed(2)),
      );
      await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
    }

    return { message: 'Review deleted' };
  }

  private assertReviewAccess(
    authUser: AuthUserPayload,
    review: { subscriberId: Types.ObjectId; userId: Types.ObjectId },
  ) {
    if (authUser.type === UserType.ADMIN) return;
    if (
      authUser.type === UserType.SUBSCRIBER &&
      review.subscriberId.toString() === authUser.userId
    ) {
      return;
    }
    throw new ForbiddenException('Access denied');
  }
}
