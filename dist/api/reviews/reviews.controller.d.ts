import { AuthUserPayload } from '../auth/auth.type';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(authUser: AuthUserPayload, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(authUser: AuthUserPayload, query: FilterReviewDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../database/schema/review.schema").ReviewDocument, {}, {}> & import("../../database/schema/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    update(authUser: AuthUserPayload, id: string, dto: UpdateReviewDto): Promise<import("../../database/schema/review.schema").ReviewDocument>;
    remove(authUser: AuthUserPayload, id: string): Promise<void>;
}
