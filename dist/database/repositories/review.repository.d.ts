import { FilterQuery, Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../schema/review.schema';
import { PaginationQuery } from 'src/helpers/pagination.helper';
import { DateFilterQuery } from 'src/helpers/date-filter.helper';
export declare class ReviewRepository {
    private readonly reviewModel;
    constructor(reviewModel: Model<ReviewDocument>);
    create(data: Partial<Review>): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findById(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, ReviewDocument, "findOne", {}>;
    findByIdForUser(id: string, userId: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, ReviewDocument, "findOne", {}>;
    findPaginated(filter: FilterQuery<ReviewDocument>, query: PaginationQuery & DateFilterQuery): Promise<{
        data: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    save(review: ReviewDocument): Promise<ReviewDocument>;
    remove(review: ReviewDocument): any;
    aggregateSum(filter: FilterQuery<ReviewDocument>, field?: 'finalAmount' | 'calculatedAmount'): import("mongoose").Aggregate<any[]>;
    aggregateByMonth(filter: FilterQuery<ReviewDocument>): import("mongoose").Aggregate<any[]>;
    getModel(): Model<ReviewDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
}
