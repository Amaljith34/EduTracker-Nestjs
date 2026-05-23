import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/database/schema/user.schema';
export declare class AuthGuard implements CanActivate {
    private reflector;
    private userModel;
    private configService;
    private secretJwtKey;
    constructor(reflector: Reflector, userModel: Model<UserDocument>, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
