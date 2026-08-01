import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserDocument } from 'src/database/schema/user.schema';
import { UserRepository } from 'src/database/repositories/user.repository';
import { HelperFunctionUtils } from 'src/helpers/helperFunction.utils';
import { logInfo, logWarn } from 'src/utils/logger/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwTPayloadType, UserType } from './auth.type';
import { DBStatus } from 'src/database/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  register = async (registerDto: RegisterDto) => {
    const { email, password, fullName, phone, type } = registerDto;
    const userType = type ?? UserType.SUBSCRIBER;

    if (userType === UserType.ADMIN) {
      throw new ForbiddenException('Admin accounts cannot self-register');
    }
    if (userType === UserType.USER) {
      throw new ForbiddenException('Users must be created by a subscriber or admin');
    }

    const existingActive = await this.userRepository.findByEmail(email);
    if (existingActive) {
      logWarn(`Register failed — email exists: ${email}`);
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await HelperFunctionUtils.hashPassword(password);
    const softDeleted = await this.userRepository.findByEmailIncludingDeleted(email);

    let user: UserDocument;
    if (softDeleted && softDeleted.status === DBStatus.DELETED) {
      const updated = await this.userRepository.updateById(softDeleted._id.toString(), {
        fullName,
        phone,
        password: hashedPassword,
        type: userType,
        status: DBStatus.ACTIVE,
        subjects: [],
      });
      user = updated!;
    } else {
      user = await this.userRepository.create({
        email,
        fullName,
        phone,
        password: hashedPassword,
        type: userType,
        status: DBStatus.ACTIVE,
        subjects: [],
        pendingAmount: 0,
      });
    }
    logInfo(`User registered: ${user._id} as ${userType}`);
    return this.buildAuthResponse(user);
  };

  login = async (loginDto: LoginDto) => {
    const { email, password, type } = loginDto;
    const user = await this.userRepository.findByEmail(email, type);
    if (!user) {
      logWarn(`Login failed — unknown email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === DBStatus.HOLD) {
      throw new ForbiddenException('Account is blocked');
    }

    const valid = await HelperFunctionUtils.comparePassword(password, user.password);
    if (!valid) {
      logWarn(`Login failed — bad password: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    logInfo(`User logged in: ${user._id}`);
    return this.buildAuthResponse(user);
  };

  selectSubscriber = async (userId: string, subscriberId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid User');

    const ids = this.getSubscriberIds(user);
    if (!ids.includes(subscriberId)) {
      throw new ForbiddenException('Not a member of this subscriber group');
    }

    user.subscriberId = new Types.ObjectId(subscriberId);
    await this.userRepository.updateById(userId, { subscriberId: user.subscriberId });
    const response = await this.buildAuthResponse(user);
    return { ...response, requiresSubscriberSelection: false };
  };

  refresh = async (refreshToken: string) => {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new UnauthorizedException('JWT refresh secret is not configured');
    }

    let decoded: JwTPayloadType;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret) as JwTPayloadType;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findByIdWithRefresh(decoded.sub!);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (user.status === DBStatus.HOLD) {
      throw new ForbiddenException('Account is blocked');
    }

    return this.buildAuthResponse(user);
  };

  logout = async (userId: string) => {
    await this.userRepository.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  };

  getProfile = async (userId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid User');
    return this.toPublicUser(user);
  };

  updateProfile = async (userId: string, dto: UpdateProfileDto) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid User');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    const updates: Partial<UserDocument> = {};
    if (dto.fullName !== undefined) updates.fullName = dto.fullName;
    if (dto.email !== undefined) updates.email = dto.email;
    if (dto.phone !== undefined) updates.phone = dto.phone;
    if (dto.password) {
      updates.password = await HelperFunctionUtils.hashPassword(dto.password);
    }

    const updated = await this.userRepository.updateById(userId, updates);
    if (!updated) throw new UnauthorizedException('Invalid User');
    logInfo(`Profile updated: ${userId}`);
    return this.toPublicUser(updated);
  };

  private toPublicUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      type: user.type,
      phone: user.phone,
      subscriberId: user.subscriberId?.toString(),
      subscriberIds: this.getSubscriberIds(user),
      subjects: user.subjects ?? [],
      status: user.status,
    };
  }

  private getSubscriberIds(user: UserDocument): string[] {
    const fromArray = (user.subscriberIds ?? []).map((id) => id.toString());
    if (fromArray.length) return fromArray;
    if (user.subscriberId) return [user.subscriberId.toString()];
    return [];
  }

  private async resolveSubscribers(ids: string[]) {
    if (!ids.length) return [];
    const docs = await this.userRepository.findByIds(ids);
    return docs.map((s) => ({
      id: s._id.toString(),
      fullName: s.fullName,
      email: s.email,
    }));
  }

  private async buildAuthResponse(user: UserDocument) {
    const userId = user._id.toString();
    const subscriberIds = this.getSubscriberIds(user);
    const activeSubscriberId = user.subscriberId?.toString() ?? subscriberIds[0];
    const payload: JwTPayloadType = {
      sub: userId,
      email: user.email,
      type: user.type,
      subscriberId: activeSubscriberId,
    };
    const tokens = this.buildTokens(payload);
    await this.userRepository.updateRefreshToken(userId, tokens.refresh_token);
    const subscribers = await this.resolveSubscribers(subscriberIds);
    const requiresSelection = user.type === UserType.USER && subscriberIds.length > 1;
    return {
      ...tokens,
      user: this.toPublicUser(user),
      subscribers,
      requiresSubscriberSelection: requiresSelection,
    };
  }

  private buildTokens(payload: JwTPayloadType) {
    if (!this.jwtService) {
      throw new Error(
        'JwtService is not injected. Ensure JwtModule.registerAsync({ global: true }) is imported in AppModule.',
      );
    }

    const access_token = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET');
    const refreshExpires =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    const refresh_token = jwt.sign(payload, refreshSecret, {
      expiresIn: refreshExpires as jwt.SignOptions['expiresIn'],
    });

    return { access_token, refresh_token };
  }
}
