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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const auth_guard_1 = require("../auth/guard/auth.guard");
const authGuardPermisssion_1 = require("../auth/decorators/authGuardPermisssion");
const authUser_1 = require("../auth/decorators/authUser");
const auth_type_1 = require("../auth/auth.type");
const dashboard_filter_dto_1 = require("../dashboard/dto/dashboard-filter.dto");
const logger_service_1 = require("../../utils/logger/logger.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getAnalytics(authUser, query) {
        (0, logger_service_1.logInfo)(`Analytics for user ${authUser.userId}`);
        return this.analyticsService.getAnalytics(authUser, query);
    }
    getAnalyticsCompat(authUser, query) {
        return this.analyticsService.getAnalytics(authUser, query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('/get'),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_filter_dto_1.DashboardFilterDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dashboard_filter_dto_1.DashboardFilterDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAnalyticsCompat", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER, auth_type_1.UserType.USER],
    }),
    (0, swagger_1.ApiBearerAuth)('Token'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map