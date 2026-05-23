import { Types } from 'mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { AuthUserPayload } from '../auth/auth.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly reviewRepository;
    private readonly transactionRepository;
    constructor(userRepository: UserRepository, reviewRepository: ReviewRepository, transactionRepository: TransactionRepository);
    create(authUser: AuthUserPayload, dto: CreateUserDto): Promise<any>;
    findAll(authUser: AuthUserPayload, query: FilterUserDto): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(authUser: AuthUserPayload, id: string): Promise<{
        user: any;
        reviews: (import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        transactions: (import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        summary: {
            totalReviewAmount: any;
            totalPaid: any;
            remainingBalance: number;
        };
    }>;
    update(authUser: AuthUserPayload, id: string, dto: UpdateUserDto): Promise<any>;
    remove(authUser: AuthUserPayload, id: string): Promise<{
        message: string;
    }>;
    private assertAccess;
    private sanitize;
}
