import { Types } from 'mongoose';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthUserPayload } from '../auth/auth.type';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { RecordStatus } from 'src/database/types';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly reviewRepository;
    private readonly userRepository;
    constructor(transactionRepository: TransactionRepository, reviewRepository: ReviewRepository, userRepository: UserRepository);
    private buildScopeFilter;
    getUserBalance(userId: string, subscriberId: string): Promise<{
        totalReviewAmount: any;
        totalPaid: any;
        pendingAmount: number;
    }>;
    create(authUser: AuthUserPayload, dto: CreateTransactionDto): Promise<{
        balance: {
            pendingAmount: number;
            totalReviewAmount: any;
            totalPaid: any;
        };
        userId: Types.ObjectId;
        subscriberId: Types.ObjectId;
        amountPaid: number;
        paymentDate: Date;
        notes?: string;
        status: RecordStatus;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
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
    getBalanceForUser(authUser: AuthUserPayload, userId: string): Promise<{
        totalReviewAmount: any;
        totalPaid: any;
        pendingAmount: number;
    }>;
    update(authUser: AuthUserPayload, id: string, dto: UpdateTransactionDto): Promise<import("../../database/schema/transaction.schema").TransactionDocument>;
    remove(authUser: AuthUserPayload, id: string): Promise<{
        message: string;
    }>;
    private assertAccess;
}
