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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const auth_guard_1 = require("./guard/auth.guard");
const authGuardPermisssion_1 = require("./decorators/authGuardPermisssion");
const authUser_1 = require("./decorators/authUser");
const auth_type_1 = require("./auth.type");
const logger_service_1 = require("../../utils/logger/logger.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        (0, logger_service_1.logInfo)(`Register request: ${registerDto.email}`);
        return this.authService.register(registerDto);
    }
    login(loginDto) {
        (0, logger_service_1.logInfo)(`Login request: ${loginDto.email}`);
        return this.authService.login(loginDto);
    }
    refresh(dto) {
        return this.authService.refresh(dto.refreshToken);
    }
    logout(authUser) {
        return this.authService.logout(authUser.userId);
    }
    getProfile(authUser) {
        (0, logger_service_1.logInfo)(`Profile request: ${authUser.userId}`);
        return this.authService.getProfile(authUser.userId);
    }
    updateProfile(authUser, dto) {
        (0, logger_service_1.logInfo)(`Profile update: ${authUser.userId}`);
        return this.authService.updateProfile(authUser.userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/register'),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Subscriber registration' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Login' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('Token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.USER, auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER],
    }),
    (0, common_1.Post)('/logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, authUser_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('Token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.USER, auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER],
    }),
    (0, common_1.Get)('/me'),
    __param(0, (0, authUser_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('Token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.USER, auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER],
    }),
    (0, common_1.Patch)('/profile'),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map