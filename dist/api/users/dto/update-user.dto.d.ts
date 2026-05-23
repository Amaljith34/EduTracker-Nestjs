import { DBStatus } from 'src/database/types';
declare class SubjectDto {
    subjectName: string;
    amountPerHour: number;
}
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    subjects?: SubjectDto[];
    status?: DBStatus;
}
export {};
