import { UserType } from './auth.type';
export interface IAuthPermissions {
    userRequired?: boolean;
    allowedUsers?: UserType[];
}
