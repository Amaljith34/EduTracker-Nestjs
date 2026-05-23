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

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private buildScopeFilter(authUser: AuthUserPayload): Record<string, unknown> {
    if (authUser.type === UserType.ADMIN) return {};
    if (authUser.type === UserType.SUBSCRIBER) {
      return { subscriberId: new Types.ObjectId(authUser.userId) };
    }
    return { userId: new Types.ObjectId(authUser.userId) };
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
    });

    return review;
  }

  async findAll(authUser: AuthUserPayload, query: FilterReviewDto) {
    const filter = this.buildScopeFilter(authUser);
    const result = await this.reviewRepository.findPaginated(filter, query);
    return paginated(result.data, result.total, result.page, result.limit);
  }

  async update(authUser: AuthUserPayload, id: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    this.assertReviewAccess(authUser, review);

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

    return this.reviewRepository.save(review);
  }

  async remove(authUser: AuthUserPayload, id: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    this.assertReviewAccess(authUser, review);
    await this.reviewRepository.remove(review);
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
