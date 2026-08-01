import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SelectSubscriberDto } from './dto/select-subscriber.dto';
import { AuthUserPayload, UserType } from './auth.type';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
            status: import("../../database/types").DBStatus;
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
    login(loginDto: LoginDto): Promise<{
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
            status: import("../../database/types").DBStatus;
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
    refresh(dto: RefreshTokenDto): Promise<{
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
            status: import("../../database/types").DBStatus;
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
    logout(authUser: AuthUserPayload): Promise<{
        message: string;
    }>;
    getProfile(authUser: AuthUserPayload): Promise<{
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
        status: import("../../database/types").DBStatus;
    }>;
    updateProfile(authUser: AuthUserPayload, dto: UpdateProfileDto): Promise<{
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
        status: import("../../database/types").DBStatus;
    }>;
    selectSubscriber(authUser: AuthUserPayload, dto: SelectSubscriberDto): Promise<{
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
            status: import("../../database/types").DBStatus;
        };
        subscribers: {
            id: string;
            fullName: string;
            email: string;
        }[];
        access_token: string;
        refresh_token: string;
    }>;
}
