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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("../../../database/schema/user.schema");
const commonQuery_database_1 = require("../../../database/commonQuery.database");
const authGuardPermisssion_1 = require("../decorators/authGuardPermisssion");
const types_1 = require("../../../database/types");
let AuthGuard = class AuthGuard {
    constructor(reflector, userModel, configService) {
        this.reflector = reflector;
        this.userModel = userModel;
        this.configService = configService;
        this.secretJwtKey = this.configService.get('JWT_SECRET') ?? '';
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authGuardPermissions = this.reflector.get(authGuardPermisssion_1.AuthGuardPermissionMetadataKey, context.getHandler());
        const token = request.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('Invalid Token');
        }
        if (authGuardPermissions?.userRequired === false) {
            return true;
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.secretJwtKey);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid Token');
        }
        const user = await commonQuery_database_1.CommonQueryDatabase.authUser(decodedToken, this.userModel);
        if (user.status === types_1.DBStatus.HOLD) {
            throw new common_1.ForbiddenException('Account is blocked');
        }
        const userType = user.type;
        const userId = user._id.toString();
        if (authGuardPermissions?.allowedUsers?.length &&
            !authGuardPermissions.allowedUsers.includes(userType)) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const normalizedUser = {
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
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [core_1.Reflector,
        mongoose_2.Model,
        config_1.ConfigService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map