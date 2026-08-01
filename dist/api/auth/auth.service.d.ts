import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserType } from './auth.type';
import { DBStatus } from 'src/database/types';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: UserRepository, jwtService: JwtService, configService: ConfigService);
    register: (registerDto: RegisterDto) => Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            type: UserType;
            phone: string;
            subscriberId: string;
            subscriberIds: string[];
            subjects: {
                subjectName: string;
                amountPerHour: number;
            }[];
            status: DBStatus;
        };
        subscribers: {
            id: string;
            fullName: string;
            email: string;
        }[];
        requiresSubscriberSelection: boolean;
        access_token: string;
        refresh_token: string;
    }>;
    login: (loginDto: LoginDto) => Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            type: UserType;
            phone: string;
            subscriberId: string;
            subscriberIds: string[];
            subjects: {
                subjectName: string;
                amountPerHour: number;
            }[];
            status: DBStatus;
        };
        subscribers: {
            id: string;
            fullName: string;
            email: string;
        }[];
        requiresSubscriberSelection: boolean;
        access_token: string;
        refresh_token: string;
    }>;
    selectSubscriber: (userId: string, subscriberId: string) => Promise<{
        requiresSubscriberSelection: boolean;
        user: {
            id: string;
            email: string;
            fullName: string;
            type: UserType;
            phone: string;
            subscriberId: string;
            subscriberIds: string[];
            subjects: {
                subjectName: string;
                amountPerHour: number;
            }[];
            status: DBStatus;
        };
        subscribers: {
            id: string;
            fullName: string;
            email: string;
        }[];
        access_token: string;
        refresh_token: string;
    }>;
    refresh: (refreshToken: string) => Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            type: UserType;
            phone: string;
            subscriberId: string;
            subscriberIds: string[];
            subjects: {
                subjectName: string;
                amountPerHour: number;
            }[];
            status: DBStatus;
        };
        subscribers: {
            id: string;
            fullName: string;
            email: string;
        }[];
        requiresSubscriberSelection: boolean;
        access_token: string;
        refresh_token: string;
    }>;
    logout: (userId: string) => Promise<{
        message: string;
    }>;
    getProfile: (userId: string) => Promise<{
        id: string;
        email: string;
        fullName: string;
        type: UserType;
        phone: string;
        subscriberId: string;
        subscriberIds: string[];
        subjects: {
            subjectName: string;
            amountPerHour: number;
        }[];
        status: DBStatus;
    }>;
    updateProfile: (userId: string, dto: UpdateProfileDto) => Promise<{
        id: string;
        email: string;
        fullName: string;
        type: UserType;
        phone: string;
        subscriberId: string;
        subscriberIds: string[];
        subjects: {
            subjectName: string;
            amountPerHour: number;
        }[];
        status: DBStatus;
    }>;
    private toPublicUser;
    private getSubscriberIds;
    private resolveSubscribers;
    private buildAuthResponse;
    private buildTokens;
}
