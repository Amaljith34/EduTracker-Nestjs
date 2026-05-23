import { AuthUserPayload } from '../auth/auth.type';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
}
