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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const user_repository_1 = require("../../database/repositories/user.repository");
const helperFunction_utils_1 = require("../../helpers/helperFunction.utils");
const logger_service_1 = require("../../utils/logger/logger.service");
const auth_type_1 = require("./auth.type");
const types_1 = require("../../database/types");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.register = async (registerDto) => {
            const { email, password, fullName, phone, type } = registerDto;
            const userType = type ?? auth_type_1.UserType.SUBSCRIBER;
            if (userType === auth_type_1.UserType.ADMIN) {
                throw new common_1.ForbiddenException('Admin accounts cannot self-register');
            }
            if (userType === auth_type_1.UserType.USER) {
                throw new common_1.ForbiddenException('Users must be created by a subscriber or admin');
            }
            const existingActive = await this.userRepository.findByEmail(email);
            if (existingActive) {
                (0, logger_service_1.logWarn)(`Register failed — email exists: ${email}`);
                throw new common_1.ConflictException('Email already in use');
            }
            const hashedPassword = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(password);
            const softDeleted = await this.userRepository.findByEmailIncludingDeleted(email);
            let user;
            if (softDeleted && softDeleted.status === types_1.DBStatus.DELETED) {
                const updated = await this.userRepository.updateById(softDeleted._id.toString(), {
                    fullName,
                    phone,
                    password: hashedPassword,
                    type: userType,
                    status: types_1.DBStatus.ACTIVE,
                    subjects: [],
                });
                user = updated;
            }
            else {
                user = await this.userRepository.create({
                    email,
                    fullName,
                    phone,
                    password: hashedPassword,
                    type: userType,
                    status: types_1.DBStatus.ACTIVE,
                    subjects: [],
                    pendingAmount: 0,
                });
            }
            (0, logger_service_1.logInfo)(`User registered: ${user._id} as ${userType}`);
            return this.buildAuthResponse(user);
        };
        this.login = async (loginDto) => {
            const { email, password, type } = loginDto;
            const user = await this.userRepository.findByEmail(email, type);
            if (!user) {
                (0, logger_service_1.logWarn)(`Login failed — unknown email: ${email}`);
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            if (user.status === types_1.DBStatus.HOLD) {
                throw new common_1.ForbiddenException('Account is blocked');
            }
            const valid = await helperFunction_utils_1.HelperFunctionUtils.comparePassword(password, user.password);
            if (!valid) {
                (0, logger_service_1.logWarn)(`Login failed — bad password: ${email}`);
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            (0, logger_service_1.logInfo)(`User logged in: ${user._id}`);
            return this.buildAuthResponse(user);
        };
        this.selectSubscriber = async (userId, subscriberId) => {
            const user = await this.userRepository.findById(userId);
            if (!user)
                throw new common_1.UnauthorizedException('Invalid User');
            const ids = this.getSubscriberIds(user);
            if (!ids.includes(subscriberId)) {
                throw new common_1.ForbiddenException('Not a member of this subscriber group');
            }
            user.subscriberId = new mongoose_1.Types.ObjectId(subscriberId);
            await this.userRepository.updateById(userId, { subscriberId: user.subscriberId });
            const response = await this.buildAuthResponse(user);
            return { ...response, requiresSubscriberSelection: false };
        };
        this.refresh = async (refreshToken) => {
            const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') ||
                this.configService.get('JWT_SECRET');
            if (!refreshSecret) {
                throw new common_1.UnauthorizedException('JWT refresh secret is not configured');
            }
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, refreshSecret);
            }
            catch {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.userRepository.findByIdWithRefresh(decoded.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (user.status === types_1.DBStatus.HOLD) {
                throw new common_1.ForbiddenException('Account is blocked');
            }
            return this.buildAuthResponse(user);
        };
        this.logout = async (userId) => {
            await this.userRepository.updateRefreshToken(userId, null);
            return { message: 'Logged out successfully' };
        };
        this.getProfile = async (userId) => {
            const user = await this.userRepository.findById(userId);
            if (!user)
                throw new common_1.UnauthorizedException('Invalid User');
            return this.toPublicUser(user);
        };
        this.updateProfile = async (userId, dto) => {
            const user = await this.userRepository.findById(userId);
            if (!user)
                throw new common_1.UnauthorizedException('Invalid User');
            if (dto.email && dto.email !== user.email) {
                const existing = await this.userRepository.findByEmail(dto.email);
                if (existing && existing._id.toString() !== userId) {
                    throw new common_1.ConflictException('Email already in use');
                }
            }
            const updates = {};
            if (dto.fullName !== undefined)
                updates.fullName = dto.fullName;
            if (dto.email !== undefined)
                updates.email = dto.email;
            if (dto.phone !== undefined)
                updates.phone = dto.phone;
            if (dto.password) {
                updates.password = await helperFunction_utils_1.HelperFunctionUtils.hashPassword(dto.password);
            }
            const updated = await this.userRepository.updateById(userId, updates);
            if (!updated)
                throw new common_1.UnauthorizedException('Invalid User');
            (0, logger_service_1.logInfo)(`Profile updated: ${userId}`);
            return this.toPublicUser(updated);
        };
    }
    toPublicUser(user) {
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
    getSubscriberIds(user) {
        const fromArray = (user.subscriberIds ?? []).map((id) => id.toString());
        if (fromArray.length)
            return fromArray;
        if (user.subscriberId)
            return [user.subscriberId.toString()];
        return [];
    }
    async resolveSubscribers(ids) {
        if (!ids.length)
            return [];
        const docs = await this.userRepository.findByIds(ids);
        return docs.map((s) => ({
            id: s._id.toString(),
            fullName: s.fullName,
            email: s.email,
        }));
    }
    async buildAuthResponse(user) {
        const userId = user._id.toString();
        const subscriberIds = this.getSubscriberIds(user);
        const activeSubscriberId = user.subscriberId?.toString() ?? subscriberIds[0];
        const payload = {
            sub: userId,
            email: user.email,
            type: user.type,
            subscriberId: activeSubscriberId,
        };
        const tokens = this.buildTokens(payload);
        await this.userRepository.updateRefreshToken(userId, tokens.refresh_token);
        const subscribers = await this.resolveSubscribers(subscriberIds);
        const requiresSelection = user.type === auth_type_1.UserType.USER && subscriberIds.length > 1;
        return {
            ...tokens,
            user: this.toPublicUser(user),
            subscribers,
            requiresSubscriberSelection: requiresSelection,
        };
    }
    buildTokens(payload) {
        if (!this.jwtService) {
            throw new Error('JwtService is not injected. Ensure JwtModule.registerAsync({ global: true }) is imported in AppModule.');
        }
        const access_token = this.jwtService.sign(payload);
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') ||
            this.configService.get('JWT_SECRET');
        const refreshExpires = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const refresh_token = jwt.sign(payload, refreshSecret, {
            expiresIn: refreshExpires,
        });
        return { access_token, refresh_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(jwt_1.JwtService)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map