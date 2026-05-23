import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/database/schema/user.schema';
import { CommonQueryDatabase } from 'src/database/commonQuery.database';
import { AuthGuardPermissionMetadataKey } from '../decorators/authGuardPermisssion';
import { IAuthPermissions } from '../auth.interface';
import { AuthUserPayload, JwTPayloadType, UserType } from '../auth.type';
import { DBStatus } from 'src/database/types';

@Injectable()
export class AuthGuard implements CanActivate {
  private secretJwtKey: string;

  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.secretJwtKey = this.configService.get<string>('JWT_SECRET') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authGuardPermissions = this.reflector.get<IAuthPermissions>(
      AuthGuardPermissionMetadataKey,
      context.getHandler(),
    );
    const token = request.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    if (authGuardPermissions?.userRequired === false) {
      return true;
    }

    let decodedToken: JwTPayloadType;
    try {
      decodedToken = jwt.verify(token, this.secretJwtKey) as JwTPayloadType;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = await CommonQueryDatabase.authUser(decodedToken, this.userModel);

    if (user.status === DBStatus.HOLD) {
      throw new ForbiddenException('Account is blocked');
    }

    const userType = user.type as UserType;
    const userId = user._id.toString();

    if (
      authGuardPermissions?.allowedUsers?.length &&
      !authGuardPermissions.allowedUsers.includes(userType)
    ) {
      throw new ForbiddenException('Access Denied');
    }

    const normalizedUser: AuthUserPayload = {
      userId,
      id: userId,
      email: user.email,
      fullName: user.fullName,
      name: user.fullName,
      role: userType,
      type: userType,
      subscriberId: user.subscriberId?.toString(),
      phone: user.phone,
    };

    request.user = normalizedUser;
    return true;
  }
}
