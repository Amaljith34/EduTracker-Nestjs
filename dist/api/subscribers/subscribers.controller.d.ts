import { AuthUserPayload } from '../auth/auth.type';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { FilterUserDto } from '../user/dto/filterUser.dto';
export declare class SubscribersController {
    private readonly subscribersService;
    constructor(subscribersService: SubscribersService);
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
    findDetails(id: string): Promise<{
        subscriber: any;
        reviews: (import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        transactions: (import("mongoose").Document<unknown, {}, import("../../database/schema/transaction.schema").TransactionDocument, {}, {}> & import("../../database/schema/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateSubscriberDto): Promise<any>;
    block(id: string): Promise<any>;
    unblock(id: string): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
