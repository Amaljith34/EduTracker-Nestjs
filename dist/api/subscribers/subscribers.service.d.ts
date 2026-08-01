import { Model, Types } from 'mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { TransactionRepository } from 'src/database/repositories/transaction.repository';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { FilterUserDto } from '../user/dto/filterUser.dto';
import { DBStatus } from 'src/database/types';
import { AuthUserPayload } from '../auth/auth.type';
import { UserDocument } from 'src/database/schema/user.schema';
export declare class SubscribersService {
    private readonly userModel;
    private readonly userRepository;
    private readonly reviewRepository;
    private readonly transactionRepository;
    constructor(userModel: Model<UserDocument>, userRepository: UserRepository, reviewRepository: ReviewRepository, transactionRepository: TransactionRepository);
    create(authUser: AuthUserPayload, dto: CreateSubscriberDto): Promise<any>;
    findAll(query: FilterUserDto): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    findDetails(id: string): Promise<{
        subscriber: any;
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
        subjects: {
            subjectName: string;
            userCount: number;
            totalAmount: number;
        }[];
        summary: {
            totalReviews: number;
            totalReviewAmount: any;
            totalAmount: any;
            totalPaid: any;
            pendingAmount: number;
            remainingBalance: number;
        };
    }>;
    update(id: string, dto: UpdateSubscriberDto): Promise<any>;
    setStatus(id: string, status: DBStatus.ACTIVE | DBStatus.HOLD): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private sanitize;
}
