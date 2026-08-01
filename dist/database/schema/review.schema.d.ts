import { Document, Types } from 'mongoose';
import { RecordStatus } from '../types';
export type ReviewDocument = Review & Document;
export declare class Review {
    userId: Types.ObjectId;
    subscriberId: Types.ObjectId;
    subjectName: string;
    amountPerHour: number;
    hours: number;
    calculatedAmount: number;
    finalAmount: number;
    date: Date;
    notes?: string;
    status: RecordStatus;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
