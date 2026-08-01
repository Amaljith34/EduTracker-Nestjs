import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../schema/review.schema';
import { DbHelpers } from 'src/utils/helper/database/db.helpers';
import { getPagination, PaginationQuery } from 'src/helpers/pagination.helper';
import { dateRangeMatch, resolveDateRange, DateFilterQuery } from 'src/helpers/date-filter.helper';
import { RecordStatus } from '../types';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  create(data: Partial<Review>) {
    return this.reviewModel.create(data);
  }

  findById(id: string) {
    DbHelpers.assertObjectId(id);
    return this.reviewModel.findById(id);
  }

  findByIdForUser(id: string, userId: string) {
    DbHelpers.assertObjectId(id);
    return this.reviewModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
  }

  async findPaginated(
    filter: FilterQuery<ReviewDocument>,
    query: PaginationQuery & DateFilterQuery,
  ) {
    const { page, limit, skip, sort } = getPagination(query);
    const { fromDate, toDate } = resolveDateRange(query);
    const mongoFilter: FilterQuery<ReviewDocument> = {
      status: { $ne: RecordStatus.DELETED },
      ...filter,
      ...dateRangeMatch('date', fromDate, toDate),
    };

    if (query.userId) {
      mongoFilter.userId = new Types.ObjectId(query.userId);
    }
    if ((query as { subjectName?: string }).subjectName) {
      mongoFilter.subjectName = {
        $regex: new RegExp(
          `^${(query as { subjectName: string }).subjectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i',
        ),
      };
    }
    if ((query as { subscriberId?: string }).subscriberId) {
      mongoFilter.subscriberId = new Types.ObjectId(
        (query as { subscriberId: string }).subscriberId,
      );
    }

    const [data, total] = await Promise.all([
      this.reviewModel
        .find(mongoFilter)
        .populate('userId', 'fullName email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.reviewModel.countDocuments(mongoFilter),
    ]);
    return { data, total, page, limit };
  }

  save(review: ReviewDocument) {
    return review.save();
  }

  remove(review: ReviewDocument) {
    return review.deleteOne();
  }

  aggregateSum(filter: FilterQuery<ReviewDocument>, field: 'finalAmount' | 'calculatedAmount' = 'finalAmount') {
    return this.reviewModel.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: `$${field}` } } },
    ]);
  }

  aggregateByMonth(filter: FilterQuery<ReviewDocument>) {
    return this.reviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$finalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  getModel() {
    return this.reviewModel;
  }
}
