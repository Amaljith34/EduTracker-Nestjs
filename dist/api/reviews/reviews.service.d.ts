import { Types } from 'mongoose';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthUserPayload } from '../auth/auth.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly userRepository;
    constructor(reviewRepository: ReviewRepository, userRepository: UserRepository);
    private buildScopeFilter;
    create(authUser: AuthUserPayload, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(authUser: AuthUserPayload, query: FilterReviewDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(authUser: AuthUserPayload, id: string, dto: UpdateReviewDto): Promise<import("../../database/schema/review.schema").ReviewDocument>;
    remove(authUser: AuthUserPayload, id: string): Promise<{
        message: string;
    }>;
    private assertReviewAccess;
}
