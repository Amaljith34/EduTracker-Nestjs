import { AuthUserPayload } from '../auth/auth.type';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(authUser: AuthUserPayload, dto: CreateTransactionDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(authUser: AuthUserPayload, query: FilterTransactionDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(authUser: AuthUserPayload, id: string, dto: UpdateTransactionDto): Promise<import("../../database/schema/transaction.schema").TransactionDocument>;
    remove(authUser: AuthUserPayload, id: string): Promise<void>;
}
