import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { HelperFunctionUtils } from 'src/helpers/helperFunction.utils';
import { UserType } from '../auth/auth.type';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { FilterUserDto } from '../users/dto/filter-user.dto';
import { DBStatus } from 'src/database/types';
import { paginated } from 'src/helpers/pagination.helper';
import { AuthUserPayload } from '../auth/auth.type';
import { UserDocument } from 'src/database/schema/user.schema';

@Injectable()
export class SubscribersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(authUser: AuthUserPayload, dto: CreateSubscriberDto) {
    const hashedPassword = await HelperFunctionUtils.hashPassword(dto.password);
    const subscriber = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      type: UserType.SUBSCRIBER,
      status: DBStatus.ACTIVE,
      subjects: [],
      createdBy: new Types.ObjectId(authUser.userId),
    });
    return this.sanitize(subscriber);
  }

  async findAll(query: FilterUserDto) {
    const result = await this.userRepository.findPaginated(
      { type: UserType.SUBSCRIBER, status: { $ne: DBStatus.DELETED } },
      query,
      query.search,
    );
    return paginated(
      result.data.map((s) => this.sanitize(s)),
      result.total,
      result.page,
      result.limit,
    );
  }

  async findOne(id: string) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }
    return this.sanitize(subscriber);
  }

  async findDetails(id: string) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }

    const subscriberFilter = { subscriberId: new Types.ObjectId(id) };
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

  async update(id: string, dto: UpdateSubscriberDto) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }
    const update: Record<string, unknown> = { ...dto };
    if (dto.password) {
      update.password = await HelperFunctionUtils.hashPassword(dto.password);
    }
    const updated = await this.userRepository.updateById(id, update);
    return this.sanitize(updated!);
  }

  async remove(id: string) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }
    await this.userRepository.softDelete(id);
    return { message: 'Subscriber deleted' };
  }

  private sanitize(user: UserDocument) {
    const obj = user.toObject();
    delete (obj as { password?: string }).password;
    delete (obj as { refreshToken?: string }).refreshToken;
    return {
      ...obj,
      id: obj._id?.toString(),
    };
  }
}
