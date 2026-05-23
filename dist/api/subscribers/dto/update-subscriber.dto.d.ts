import { DBStatus } from 'src/database/types';
export declare class UpdateSubscriberDto {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    status?: DBStatus;
}
