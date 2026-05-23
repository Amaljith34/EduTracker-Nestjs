import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthGuardPermissions } from '../auth/decorators/authGuardPermisssion';
import { AuthUser } from '../auth/decorators/authUser';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
@AuthGuardPermissions({
  allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(
    @AuthUser() authUser: AuthUserPayload,
    @Query() query: DashboardFilterDto,
  ) {
    return this.dashboardService.getDashboard(authUser, query);
  }

  @Get('analytics')
  getAnalytics(
    @AuthUser() authUser: AuthUserPayload,
    @Query() query: DashboardFilterDto,
  ) {
    return this.dashboardService.getDashboard(authUser, query);
  }
}
