import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { DbHelpers } from 'src/utils/helper/database/db.helpers';
import { getPagination, PaginationQuery } from 'src/helpers/pagination.helper';
import { dateRangeMatch, resolveDateRange, DateFilterQuery } from 'src/helpers/date-filter.helper';
import { RecordStatus } from '../types';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  create(data: Partial<Transaction>) {
    return this.transactionModel.create(data);
  }

  findById(id: string) {
    DbHelpers.assertObjectId(id);
    return this.transactionModel.findById(id);
  }

  async findPaginated(
    filter: FilterQuery<TransactionDocument>,
    query: PaginationQuery & DateFilterQuery,
  ) {
    const { page, limit, skip, sort } = getPagination(query);
    const { fromDate, toDate } = resolveDateRange(query);
    const mongoFilter: FilterQuery<TransactionDocument> = {
      status: { $ne: RecordStatus.DELETED },
      ...filter,
      ...dateRangeMatch('paymentDate', fromDate, toDate),
    };

    if (query.userId) {
      mongoFilter.userId = new Types.ObjectId(query.userId);
    }
    if ((query as { subscriberId?: string }).subscriberId) {
      mongoFilter.subscriberId = new Types.ObjectId(
        (query as { subscriberId: string }).subscriberId,
      );
    }

    const [data, total] = await Promise.all([
      this.transactionModel
        .find(mongoFilter)
        .populate('userId', 'fullName email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.transactionModel.countDocuments(mongoFilter),
    ]);
    return { data, total, page, limit };
  }

  save(transaction: TransactionDocument) {
    return transaction.save();
  }

  remove(transaction: TransactionDocument) {
    return transaction.deleteOne();
  }

  aggregateSum(filter: FilterQuery<TransactionDocument>) {
    return this.transactionModel.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
  }

  aggregateByMonth(filter: FilterQuery<TransactionDocument>) {
    return this.transactionModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
          total: { $sum: '$amountPaid' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  getModel() {
    return this.transactionModel;
  }
}
