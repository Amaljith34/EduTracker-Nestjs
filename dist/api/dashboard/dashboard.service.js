"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const user_repository_1 = require("../../database/repositories/user.repository");
const review_repository_1 = require("../../database/repositories/review.repository");
const transaction_repository_1 = require("../../database/repositories/transaction.repository");
const auth_type_1 = require("../auth/auth.type");
const date_filter_helper_1 = require("../../helpers/date-filter.helper");
const types_1 = require("../../database/types");
let DashboardService = class DashboardService {
    constructor(userRepository, reviewRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.transactionRepository = transactionRepository;
    }
    async getDashboard(authUser, query) {
        const { fromDate, toDate } = (0, date_filter_helper_1.resolveDateRange)(query);
        const scope = this.buildScope(authUser, query.userId);
        const dateFilter = (0, date_filter_helper_1.dateRangeMatch)('date', fromDate, toDate);
        const paymentDateFilter = (0, date_filter_helper_1.dateRangeMatch)('paymentDate', fromDate, toDate);
        const notDeleted = { status: { $ne: types_1.RecordStatus.DELETED } };
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
        const [totalUsers, totalSubscribers, totalReviews, totalTransactions, reviewSum, txnSum, weeklyRevenue, monthlyRevenue, yearlyRevenue, monthlyEarnings, reviewCountByMonth, paymentByMonth,] = await Promise.all([
            authUser.type === auth_type_1.UserType.ADMIN
                ? this.userRepository.countByType(auth_type_1.UserType.USER, scope.subscriberId ? { subscriberId: scope.subscriberId } : {})
                : this.userRepository.countByType(auth_type_1.UserType.USER, {
                    subscriberId: new mongoose_1.Types.ObjectId(authUser.userId),
                }),
            authUser.type === auth_type_1.UserType.ADMIN
                ? this.userRepository.countByType(auth_type_1.UserType.SUBSCRIBER)
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
    buildScope(authUser, userId) {
        if (userId)
            return { userId: new mongoose_1.Types.ObjectId(userId) };
        if (authUser.type === auth_type_1.UserType.ADMIN)
            return {};
        if (authUser.type === auth_type_1.UserType.SUBSCRIBER) {
            return { subscriberId: new mongoose_1.Types.ObjectId(authUser.userId) };
        }
        return { userId: new mongoose_1.Types.ObjectId(authUser.userId) };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        review_repository_1.ReviewRepository,
        transaction_repository_1.TransactionRepository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map