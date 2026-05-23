import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { AuthUserPayload } from '../auth/auth.type';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
export declare class DashboardService {
    private readonly userRepository;
    private readonly reviewRepository;
    private readonly transactionRepository;
    constructor(userRepository: UserRepository, reviewRepository: ReviewRepository, transactionRepository: TransactionRepository);
    getDashboard(authUser: AuthUserPayload, query: DashboardFilterDto): Promise<{
        stats: {
            totalUsers: number;
            totalSubscribers: number;
            totalReviews: number;
            totalTransactions: number;
            totalAmount: any;
            totalPaid: any;
            remainingBalance: number;
            weeklyRevenue: any;
            monthlyRevenue: any;
            yearlyRevenue: any;
        };
        charts: {
            monthlyEarnings: any[];
            reviewCountByMonth: any[];
            paymentTracking: any[];
            revenueAnalytics: any[];
        };
    }>;
    private buildScope;
}
