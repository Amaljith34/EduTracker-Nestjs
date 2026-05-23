import { Types } from 'mongoose';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthUserPayload } from '../auth/auth.type';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly userRepository;
    constructor(transactionRepository: TransactionRepository, userRepository: UserRepository);
    private buildScopeFilter;
    create(authUser: AuthUserPayload, dto: CreateTransactionDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(authUser: AuthUserPayload, query: FilterTransactionDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    private assertAccess;
}
