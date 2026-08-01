import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { HelperFunctionUtils } from 'src/helpers/helperFunction.utils';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FilterUserDto } from './dto/filterUser.dto';
import { DBStatus } from 'src/database/types';
import { User, UserDocument } from 'src/database/schema/user.schema';
import { paginated } from 'src/helpers/pagination.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly reviewRepository: ReviewRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(authUser: AuthUserPayload, dto: CreateUserDto) {
    let subscriberId = authUser.userId;

    if (authUser.type === UserType.ADMIN) {
      if (!dto.subscriberId) {
        throw new ForbiddenException('subscriberId required for admin');
      }
      subscriberId = dto.subscriberId;
    } else if (authUser.type !== UserType.SUBSCRIBER) {
      throw new ForbiddenException('Only subscribers or admins can create users');
    }

    const hashedPassword = await HelperFunctionUtils.hashPassword(dto.password);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      type: UserType.USER,
      subscriberId: new Types.ObjectId(subscriberId),
      subscriberIds: [new Types.ObjectId(subscriberId)],
      subjects: dto.subjects ?? [],
      status: DBStatus.ACTIVE,
      createdBy: new Types.ObjectId(authUser.userId),
    });

    return this.sanitize(user);
  }

  async findAll(authUser: AuthUserPayload, query: FilterUserDto) {
    const filter: FilterQuery<UserDocument> = {
      type: UserType.USER,
      status: { $ne: DBStatus.DELETED },
    };

    if (authUser.type === UserType.SUBSCRIBER) {
      filter.subscriberId = new Types.ObjectId(authUser.userId);
    } else if (authUser.type === UserType.ADMIN && query.subscriberId) {
      filter.subscriberId = new Types.ObjectId(query.subscriberId);
    }

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit),
      this.userModel.countDocuments(filter),
    ]);

    return paginated(
      data.map((u) => this.sanitize(u)),
      total,
      page,
      limit,
    );
  }

  async findOne(authUser: AuthUserPayload, id: string) {
    const user = await this.userModel.findById(id);
    if (!user || user.type !== UserType.USER) {
      throw new NotFoundException('User not found');
    }
    this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());

    const userFilter = { userId: new Types.ObjectId(id) };
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

  async update(authUser: AuthUserPayload, id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user || user.type !== UserType.USER) {
      throw new NotFoundException('User not found');
    }
    this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());

    const update: Record<string, unknown> = { ...dto };
    if (dto.password) {
      update.password = await HelperFunctionUtils.hashPassword(dto.password);
    }

    const updated = await this.userModel.findByIdAndUpdate(id, update, { new: true });
    return this.sanitize(updated!);
  }

  async remove(authUser: AuthUserPayload, id: string) {
    const user = await this.userModel.findById(id);
    if (!user || user.type !== UserType.USER) {
      throw new NotFoundException('User not found');
    }
    this.assertAccess(authUser, user.subscriberId?.toString(), user._id.toString());
    await this.userModel.findByIdAndUpdate(id, { status: DBStatus.DELETED });
    return { message: 'User deleted' };
  }

  private assertAccess(
    authUser: AuthUserPayload,
    subscriberId?: string,
    userId?: string,
  ) {
    if (authUser.type === UserType.ADMIN) return;
    if (authUser.type === UserType.SUBSCRIBER && authUser.userId === subscriberId) {
      return;
    }
    if (authUser.type === UserType.USER && authUser.userId === userId) {
      return;
    }
    throw new ForbiddenException('Access denied');
  }

  private sanitize(user: UserDocument) {
    const obj = user.toObject();
    delete (obj as { password?: string }).password;
    delete (obj as { refreshToken?: string }).refreshToken;
    return obj;
  }
}
