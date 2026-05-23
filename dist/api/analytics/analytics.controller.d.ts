import { AnalyticsService } from './analytics.service';
import { AuthUserPayload } from '../auth/auth.type';
import { DashboardFilterDto } from '../dashboard/dto/dashboard-filter.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAnalytics(authUser: AuthUserPayload, query: DashboardFilterDto): Promise<{
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
    getAnalyticsCompat(authUser: AuthUserPayload, query: DashboardFilterDto): Promise<{
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
}
