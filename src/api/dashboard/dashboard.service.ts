import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { dateRangeMatch, resolveDateRange } from 'src/helpers/date-filter.helper';
import { RecordStatus } from 'src/database/types';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getDashboard(authUser: AuthUserPayload, query: DashboardFilterDto) {
    const { fromDate, toDate } = resolveDateRange(query);
    const scope = this.buildScope(authUser, query.userId);
    const dateFilter = dateRangeMatch('date', fromDate, toDate);
    const paymentDateFilter = dateRangeMatch('paymentDate', fromDate, toDate);
    const notDeleted = { status: { $ne: RecordStatus.DELETED } };

    const reviewFilter = { ...scope, ...notDeleted, ...dateFilter };
    const txnFilter = { ...scope, ...notDeleted, ...paymentDateFilter };

    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    weekStart.setDate(weekStart.getDate() - diffToMonday);
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [
      totalUsers,
      totalSubscribers,
      totalReviews,
      totalTransactions,
      reviewSum,
      txnSum,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      monthlyEarnings,
      reviewCountByMonth,
      paymentByMonth,
    ] = await Promise.all([
      authUser.type === UserType.ADMIN
        ? this.userRepository.countByType(UserType.USER, scope.subscriberId ? { subscriberId: scope.subscriberId as Types.ObjectId } : {})
        : this.userRepository.countByType(UserType.USER, {
            subscriberId: new Types.ObjectId(authUser.userId),
          }),
      authUser.type === UserType.ADMIN
        ? this.userRepository.countByType(UserType.SUBSCRIBER)
        : Promise.resolve(0),
      this.reviewRepository.getModel().countDocuments(reviewFilter),
      this.transactionRepository.getModel().countDocuments(txnFilter),
      this.reviewRepository.aggregateSum(reviewFilter),
      this.transactionRepository.aggregateSum(txnFilter),
      this.reviewRepository.aggregateSum({
        ...scope,
        ...notDeleted,
        date: { $gte: weekStart, $lte: now },
      }),
      this.reviewRepository.aggregateSum({
        ...scope,
        ...notDeleted,
        date: { $gte: monthStart, $lte: now },
      }),
      this.reviewRepository.aggregateSum({
        ...scope,
        ...notDeleted,
        date: { $gte: yearStart, $lte: now },
      }),
      this.reviewRepository.aggregateByMonth({ ...scope, ...notDeleted }),
      this.reviewRepository.aggregateByMonth(reviewFilter),
      this.transactionRepository.aggregateByMonth(txnFilter),
    ]);

    const totalAmount = reviewSum[0]?.total ?? 0;
    const totalPaid = txnSum[0]?.total ?? 0;

    return {
      stats: {
        totalUsers,
        totalSubscribers,
        totalReviews,
        totalTransactions,
        totalAmount,
        totalPaid,
        remainingBalance: Number((totalAmount - totalPaid).toFixed(2)),
        weeklyRevenue: weeklyRevenue[0]?.total ?? 0,
        monthlyRevenue: monthlyRevenue[0]?.total ?? 0,
        yearlyRevenue: yearlyRevenue[0]?.total ?? 0,
      },
      charts: {
        monthlyEarnings,
        reviewCountByMonth,
        paymentTracking: paymentByMonth,
        revenueAnalytics: monthlyEarnings,
      },
    };
  }

  private buildScope(authUser: AuthUserPayload, userId?: string): Record<string, unknown> {
    if (userId) return { userId: new Types.ObjectId(userId) };
    if (authUser.type === UserType.ADMIN) return {};
    if (authUser.type === UserType.SUBSCRIBER) {
      return { subscriberId: new Types.ObjectId(authUser.userId) };
    }
    return { userId: new Types.ObjectId(authUser.userId) };
  }
}
