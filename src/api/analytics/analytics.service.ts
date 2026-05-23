import { Injectable } from '@nestjs/common';
import { DashboardService } from '../dashboard/dashboard.service';
import { AuthUserPayload } from '../auth/auth.type';
import { DashboardFilterDto } from '../dashboard/dto/dashboard-filter.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dashboardService: DashboardService) {}

  getAnalytics = async (authUser: AuthUserPayload, query: DashboardFilterDto = {}) => {
    return this.dashboardService.getDashboard(authUser, query);
  };
}
