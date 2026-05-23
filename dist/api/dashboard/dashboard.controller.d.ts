import { AuthUserPayload } from '../auth/auth.type';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
}
