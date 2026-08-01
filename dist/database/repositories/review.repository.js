"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("../schema/review.schema");
const db_helpers_1 = require("../../utils/helper/database/db.helpers");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const date_filter_helper_1 = require("../../helpers/date-filter.helper");
const types_1 = require("../types");
let ReviewRepository = class ReviewRepository {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    create(data) {
        return this.reviewModel.create(data);
    }
    findById(id) {
        db_helpers_1.DbHelpers.assertObjectId(id);
        return this.reviewModel.findById(id);
    }
    findByIdForUser(id, userId) {
        db_helpers_1.DbHelpers.assertObjectId(id);
        return this.reviewModel.findOne({
            _id: id,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
    }
    async findPaginated(filter, query) {
        const { page, limit, skip, sort } = (0, pagination_helper_1.getPagination)(query);
        const { fromDate, toDate } = (0, date_filter_helper_1.resolveDateRange)(query);
        const mongoFilter = {
            status: { $ne: types_1.RecordStatus.DELETED },
            ...filter,
            ...(0, date_filter_helper_1.dateRangeMatch)('date', fromDate, toDate),
        };
        if (query.userId) {
            mongoFilter.userId = new mongoose_2.Types.ObjectId(query.userId);
        }
        if (query.subjectName) {
            mongoFilter.subjectName = {
                $regex: new RegExp(`^${query.subjectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
            };
        }
        if (query.subscriberId) {
            mongoFilter.subscriberId = new mongoose_2.Types.ObjectId(query.subscriberId);
        }
        const [data, total] = await Promise.all([
            this.reviewModel
                .find(mongoFilter)
                .populate('userId', 'fullName email phone')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.reviewModel.countDocuments(mongoFilter),
        ]);
        return { data, total, page, limit };
    }
    save(review) {
        return review.save();
    }
    remove(review) {
        return review.deleteOne();
    }
    aggregateSum(filter, field = 'finalAmount') {
        return this.reviewModel.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: `$${field}` } } },
        ]);
    }
    aggregateByMonth(filter) {
        return this.reviewModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                    total: { $sum: '$finalAmount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
    }
    getModel() {
        return this.reviewModel;
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReviewRepository);
//# sourceMappingURL=review.repository.js.map