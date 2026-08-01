import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { paginated } from 'src/helpers/pagination.helper';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { RecordStatus } from 'src/database/types';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
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

  async getUserBalance(userId: string, subscriberId: string) {
    const filter = {
      userId: new Types.ObjectId(userId),
      subscriberId: new Types.ObjectId(subscriberId),
      status: { $ne: RecordStatus.DELETED },
    };
    const [reviewSum, txnSum] = await Promise.all([
      this.reviewRepository.aggregateSum(filter),
      this.transactionRepository.aggregateSum(filter),
    ]);
    const totalReviewAmount = reviewSum[0]?.total ?? 0;
    const totalPaid = txnSum[0]?.total ?? 0;
    const pendingAmount = Math.max(
      0,
      Number((totalReviewAmount - totalPaid).toFixed(2)),
    );
    return { totalReviewAmount, totalPaid, pendingAmount };
  }

  async create(authUser: AuthUserPayload, dto: CreateTransactionDto) {
    if (authUser.type === UserType.USER) {
      throw new ForbiddenException('Users cannot create transactions');
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

    const balance = await this.getUserBalance(dto.userId, subscriberId);

    if (dto.amountPaid > balance.pendingAmount) {
      throw new BadRequestException(
        `Payment amount (₹${dto.amountPaid}) exceeds pending balance (₹${balance.pendingAmount})`,
      );
    }

    const txn = await this.transactionRepository.create({
      userId: new Types.ObjectId(dto.userId),
      subscriberId: new Types.ObjectId(subscriberId),
      amountPaid: dto.amountPaid,
      paymentDate: new Date(dto.paymentDate),
      notes: dto.notes,
      status: RecordStatus.APPROVED,
    });

    const pendingAmount = Math.max(
      0,
      Number(((endUser.pendingAmount || balance.pendingAmount) - dto.amountPaid).toFixed(2)),
    );
    await this.userRepository.updateById(dto.userId, { pendingAmount });

    return {
      ...txn.toObject(),
      balance: {
        ...balance,
        pendingAmount,
      },
    };
  }

  async findAll(authUser: AuthUserPayload, query: FilterTransactionDto) {
    const filter = this.buildScopeFilter(authUser);
    const result = await this.transactionRepository.findPaginated(filter, query);
    return paginated(result.data, result.total, result.page, result.limit);
  }

  async getBalanceForUser(authUser: AuthUserPayload, userId: string) {
    const endUser = await this.userRepository.findById(userId);
    if (!endUser || endUser.type !== UserType.USER) {
      throw new NotFoundException('User not found');
    }

    const subscriberId =
      authUser.type === UserType.ADMIN
        ? endUser.subscriberId?.toString()
        : authUser.type === UserType.SUBSCRIBER
          ? authUser.userId
          : endUser.subscriberId?.toString();

    if (!subscriberId) {
      throw new ForbiddenException('Access denied');
    }

    if (
      authUser.type === UserType.SUBSCRIBER &&
      endUser.subscriberId?.toString() !== authUser.userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.getUserBalance(userId, subscriberId);
  }

  async update(authUser: AuthUserPayload, id: string, dto: UpdateTransactionDto) {
    const txn = await this.transactionRepository.findById(id);
    if (!txn || txn.status === RecordStatus.DELETED) {
      throw new NotFoundException('Transaction not found');
    }
    this.assertAccess(authUser, txn);

    const previousAmount = txn.amountPaid;

    if (dto.amountPaid !== undefined) {
      const balance = await this.getUserBalance(
        txn.userId.toString(),
        txn.subscriberId.toString(),
      );
      // Allow previous payment back into available balance when editing
      const available = balance.pendingAmount + previousAmount;
      if (dto.amountPaid > available) {
        throw new BadRequestException(
          `Payment amount (₹${dto.amountPaid}) exceeds pending balance (₹${available})`,
        );
      }
      txn.amountPaid = dto.amountPaid;
    }
    if (dto.paymentDate) txn.paymentDate = new Date(dto.paymentDate);
    if (dto.notes !== undefined) txn.notes = dto.notes;
    if (dto.status) txn.status = dto.status;

    const saved = await this.transactionRepository.save(txn);

    if (dto.amountPaid !== undefined && dto.amountPaid !== previousAmount) {
      const endUser = await this.userRepository.findById(txn.userId.toString());
      if (endUser) {
        const delta = dto.amountPaid - previousAmount;
        const pendingAmount = Math.max(
          0,
          Number(((endUser.pendingAmount || 0) - delta).toFixed(2)),
        );
        await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
      }
    }

    return saved;
  }

  async remove(authUser: AuthUserPayload, id: string) {
    const txn = await this.transactionRepository.findById(id);
    if (!txn || txn.status === RecordStatus.DELETED) {
      throw new NotFoundException('Transaction not found');
    }
    this.assertAccess(authUser, txn);

    txn.status = RecordStatus.DELETED;
    await this.transactionRepository.save(txn);

    const endUser = await this.userRepository.findById(txn.userId.toString());
    if (endUser) {
      const pendingAmount = Number(
        ((endUser.pendingAmount || 0) + txn.amountPaid).toFixed(2),
      );
      await this.userRepository.updateById(endUser._id.toString(), { pendingAmount });
    }

    return { message: 'Transaction deleted' };
  }

  private assertAccess(
    authUser: AuthUserPayload,
    txn: { subscriberId: Types.ObjectId },
  ) {
    if (authUser.type === UserType.ADMIN) return;
    if (
      authUser.type === UserType.SUBSCRIBER &&
      txn.subscriberId.toString() === authUser.userId
    ) {
      return;
    }
    throw new ForbiddenException('Access denied');
  }
}
