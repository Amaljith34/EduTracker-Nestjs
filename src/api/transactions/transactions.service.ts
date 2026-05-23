import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { paginated } from 'src/helpers/pagination.helper';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private buildScopeFilter(authUser: AuthUserPayload): Record<string, unknown> {
    if (authUser.type === UserType.ADMIN) return {};
    if (authUser.type === UserType.SUBSCRIBER) {
      return { subscriberId: new Types.ObjectId(authUser.userId) };
    }
    return { userId: new Types.ObjectId(authUser.userId) };
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

    return this.transactionRepository.create({
      userId: new Types.ObjectId(dto.userId),
      subscriberId: new Types.ObjectId(subscriberId),
      amountPaid: dto.amountPaid,
      paymentDate: new Date(dto.paymentDate),
      notes: dto.notes,
    });
  }

  async findAll(authUser: AuthUserPayload, query: FilterTransactionDto) {
    const filter = this.buildScopeFilter(authUser);
    const result = await this.transactionRepository.findPaginated(filter, query);
    return paginated(result.data, result.total, result.page, result.limit);
  }

  async update(authUser: AuthUserPayload, id: string, dto: UpdateTransactionDto) {
    const txn = await this.transactionRepository.findById(id);
    if (!txn) throw new NotFoundException('Transaction not found');
    this.assertAccess(authUser, txn);

    if (dto.amountPaid !== undefined) txn.amountPaid = dto.amountPaid;
    if (dto.paymentDate) txn.paymentDate = new Date(dto.paymentDate);
    if (dto.notes !== undefined) txn.notes = dto.notes;

    return this.transactionRepository.save(txn);
  }

  async remove(authUser: AuthUserPayload, id: string) {
    const txn = await this.transactionRepository.findById(id);
    if (!txn) throw new NotFoundException('Transaction not found');
    this.assertAccess(authUser, txn);
    await this.transactionRepository.remove(txn);
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
