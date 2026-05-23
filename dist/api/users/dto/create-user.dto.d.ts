declare class SubjectDto {
    subjectName: string;
    amountPerHour: number;
}
export declare class CreateUserDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    subjects?: SubjectDto[];
    subscriberId?: string;
}
export {};
