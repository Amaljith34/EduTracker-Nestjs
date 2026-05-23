import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
            subjects: import("../../database/schema/user-subject.schema").UserSubject[];
            status: import("../../database/types").DBStatus;
        };
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
            subjects: import("../../database/schema/user-subject.schema").UserSubject[];
            status: import("../../database/types").DBStatus;
        };
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
            subjects: import("../../database/schema/user-subject.schema").UserSubject[];
            status: import("../../database/types").DBStatus;
        };
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
        subjects: import("../../database/schema/user-subject.schema").UserSubject[];
        status: import("../../database/types").DBStatus;
    }>;
    updateProfile(authUser: AuthUserPayload, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        type: UserType;
        phone: string;
        subscriberId: string;
        subjects: import("../../database/schema/user-subject.schema").UserSubject[];
        status: import("../../database/types").DBStatus;
    }>;
}
