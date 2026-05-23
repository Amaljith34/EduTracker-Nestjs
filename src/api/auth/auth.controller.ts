import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SelectSubscriberDto } from './dto/select-subscriber.dto';
import { AuthGuard } from './guard/auth.guard';
import { AuthGuardPermissions } from './decorators/authGuardPermisssion';
import { AuthUser } from './decorators/authUser';
import { AuthUserPayload, UserType } from './auth.type';
import { logInfo } from 'src/utils/logger/logger.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({ description: 'Subscriber registration' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    logInfo(`Register request: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    logInfo(`Login request: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @AuthGuardPermissions({
    allowedUsers: [UserType.USER, UserType.ADMIN, UserType.SUBSCRIBER],
  })
  @Post('/logout')
  @HttpCode(200)
  logout(@AuthUser() authUser: AuthUserPayload) {
    return this.authService.logout(authUser.userId);
  }

  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @AuthGuardPermissions({
    allowedUsers: [UserType.USER, UserType.ADMIN, UserType.SUBSCRIBER],
  })
  @Get('/me')
  getProfile(@AuthUser() authUser: AuthUserPayload) {
    logInfo(`Profile request: ${authUser.userId}`);
    return this.authService.getProfile(authUser.userId);
  }

  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @AuthGuardPermissions({
    allowedUsers: [UserType.USER, UserType.ADMIN, UserType.SUBSCRIBER],
  })
  @Patch('/profile')
  updateProfile(
    @AuthUser() authUser: AuthUserPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    logInfo(`Profile update: ${authUser.userId}`);
    return this.authService.updateProfile(authUser.userId, dto);
  }

  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @AuthGuardPermissions({
    allowedUsers: [UserType.USER],
  })
  @Post('/select-subscriber')
  @HttpCode(200)
  selectSubscriber(
    @AuthUser() authUser: AuthUserPayload,
    @Body() dto: SelectSubscriberDto,
  ) {
    return this.authService.selectSubscriber(authUser.userId, dto.subscriberId);
  }
}
