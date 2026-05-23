import { UserType } from '../auth.type';
export declare class RegisterDto {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    type?: UserType;
}
