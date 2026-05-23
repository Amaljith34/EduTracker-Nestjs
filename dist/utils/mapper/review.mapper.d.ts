import { ReviewDocument } from 'src/database/schema/review.schema';
export declare class ReviewMapper {
    static toResponse(r: ReviewDocument): {
        id: string;
        userId: string;
        subscriberId: string;
        subjectName: string;
        amountPerHour: number;
        hours: number;
        calculatedAmount: number;
        finalAmount: number;
        date: string;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
    };
    static toResponseList(rows: ReviewDocument[]): {
        id: string;
        userId: string;
        subscriberId: string;
        subjectName: string;
        amountPerHour: number;
        hours: number;
        calculatedAmount: number;
        finalAmount: number;
        date: string;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}
