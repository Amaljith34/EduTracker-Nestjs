import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthGuardPermissions } from '../auth/decorators/authGuardPermisssion';
import { AuthUser } from '../auth/decorators/authUser';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { DashboardFilterDto } from '../dashboard/dto/dashboard-filter.dto';
import { logInfo } from 'src/utils/logger/logger.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(AuthGuard)
@AuthGuardPermissions({
  allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
})
@ApiBearerAuth('Token')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/get')
  getAnalytics(
    @AuthUser() authUser: AuthUserPayload,
    @Query() query: DashboardFilterDto,
  ) {
    logInfo(`Analytics for user ${authUser.userId}`);
    return this.analyticsService.getAnalytics(authUser, query);
  }

  @Get()
  getAnalyticsCompat(
    @AuthUser() authUser: AuthUserPayload,
    @Query() query: DashboardFilterDto,
  ) {
    return this.analyticsService.getAnalytics(authUser, query);
  }
}
