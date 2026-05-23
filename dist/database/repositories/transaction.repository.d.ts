import { FilterQuery, Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schema/transaction.schema';
import { PaginationQuery } from 'src/helpers/pagination.helper';
import { DateFilterQuery } from 'src/helpers/date-filter.helper';
export declare class TransactionRepository {
    private readonly transactionModel;
    constructor(transactionModel: Model<TransactionDocument>);
    create(data: Partial<Transaction>): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findById(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, TransactionDocument, "findOne", {}>;
    findPaginated(filter: FilterQuery<TransactionDocument>, query: PaginationQuery & DateFilterQuery): Promise<{
        data: (import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    save(transaction: TransactionDocument): Promise<TransactionDocument>;
    remove(transaction: TransactionDocument): any;
    aggregateSum(filter: FilterQuery<TransactionDocument>): import("mongoose").Aggregate<any[]>;
    aggregateByMonth(filter: FilterQuery<TransactionDocument>): import("mongoose").Aggregate<any[]>;
    getModel(): Model<TransactionDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, TransactionDocument, {}, {}> & Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
}
