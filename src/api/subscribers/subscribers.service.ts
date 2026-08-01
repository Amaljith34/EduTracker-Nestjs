import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { HelperFunctionUtils } from 'src/helpers/helperFunction.utils';
import { assertEmailPhoneAvailable } from 'src/helpers/user-uniqueness.helper';
import { UserType } from '../auth/auth.type';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { FilterUserDto } from '../user/dto/filterUser.dto';
import { DBStatus, RecordStatus } from 'src/database/types';
import { paginated } from 'src/helpers/pagination.helper';
import { AuthUserPayload } from '../auth/auth.type';
import { User, UserDocument } from 'src/database/schema/user.schema';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(authUser: AuthUserPayload, dto: CreateSubscriberDto) {
    const { softDeletedMatch } = await assertEmailPhoneAvailable(this.userModel, {
      email: dto.email,
      phone: dto.phone,
      creatingType: UserType.SUBSCRIBER,
    });

    const hashedPassword = await HelperFunctionUtils.hashPassword(dto.password);

    if (
      softDeletedMatch &&
      softDeletedMatch.type === UserType.SUBSCRIBER &&
      softDeletedMatch.email === dto.email.trim().toLowerCase()
    ) {
      const restored = await this.userRepository.updateById(softDeletedMatch._id.toString(), {
        fullName: dto.fullName,
        phone: dto.phone,
        password: hashedPassword,
        type: UserType.SUBSCRIBER,
        status: DBStatus.ACTIVE,
        subjects: [],
        createdBy: new Types.ObjectId(authUser.userId),
      });
      return this.sanitize(restored!);
    }

    const subscriber = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      type: UserType.SUBSCRIBER,
      status: DBStatus.ACTIVE,
      subjects: [],
      pendingAmount: 0,
      createdBy: new Types.ObjectId(authUser.userId),
    });
    return this.sanitize(subscriber);
  }

  async findAll(query: FilterUserDto) {
    const filter: Record<string, unknown> = {
      type: UserType.SUBSCRIBER,
      status: { $ne: DBStatus.DELETED },
    };
    if (query.status) {
      filter.status = query.status;
    }

    const result = await this.userRepository.findPaginated(
      filter,
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

    const subscriberFilter = {
      subscriberId: new Types.ObjectId(id),
      status: { $ne: RecordStatus.DELETED },
    };
    const [reviewsResult, transactionsResult, reviewSum, txnSum, reviewCount, users] =
      await Promise.all([
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

    // Aggregate subjects taken by this subscriber's users
    const subjectMap = new Map<
      string,
      { subjectName: string; userCount: number; totalAmount: number }
    >();

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

  async update(id: string, dto: UpdateSubscriberDto) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }

    if (dto.email || dto.phone) {
      await assertEmailPhoneAvailable(this.userModel, {
        email: dto.email ?? subscriber.email,
        phone: dto.phone ?? subscriber.phone,
        excludeId: id,
        creatingType: UserType.SUBSCRIBER,
      });
    }

    const update: Record<string, unknown> = { ...dto };
    if (dto.password) {
      update.password = await HelperFunctionUtils.hashPassword(dto.password);
    }
    const updated = await this.userRepository.updateById(id, update);
    return this.sanitize(updated!);
  }

  async setStatus(id: string, status: DBStatus.ACTIVE | DBStatus.HOLD) {
    const subscriber = await this.userRepository.findById(id);
    if (!subscriber || subscriber.type !== UserType.SUBSCRIBER) {
      throw new NotFoundException('Subscriber not found');
    }
    const updated = await this.userRepository.updateById(id, { status });
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
