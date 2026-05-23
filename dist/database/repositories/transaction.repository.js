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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../schema/transaction.schema");
const db_helpers_1 = require("../../utils/helper/database/db.helpers");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const date_filter_helper_1 = require("../../helpers/date-filter.helper");
let TransactionRepository = class TransactionRepository {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    create(data) {
        return this.transactionModel.create(data);
    }
    findById(id) {
        db_helpers_1.DbHelpers.assertObjectId(id);
        return this.transactionModel.findById(id);
    }
    async findPaginated(filter, query) {
        const { page, limit, skip, sort } = (0, pagination_helper_1.getPagination)(query);
        const { fromDate, toDate } = (0, date_filter_helper_1.resolveDateRange)(query);
        const mongoFilter = {
            ...filter,
            ...(0, date_filter_helper_1.dateRangeMatch)('paymentDate', fromDate, toDate),
        };
        if (query.userId) {
            mongoFilter.userId = new mongoose_2.Types.ObjectId(query.userId);
        }
        if (query.subscriberId) {
            mongoFilter.subscriberId = new mongoose_2.Types.ObjectId(query.subscriberId);
        }
        const [data, total] = await Promise.all([
            this.transactionModel
                .find(mongoFilter)
                .populate('userId', 'fullName email phone')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.transactionModel.countDocuments(mongoFilter),
        ]);
        return { data, total, page, limit };
    }
    save(transaction) {
        return transaction.save();
    }
    remove(transaction) {
        return transaction.deleteOne();
    }
    aggregateSum(filter) {
        return this.transactionModel.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: '$amountPaid' } } },
        ]);
    }
    aggregateByMonth(filter) {
        return this.transactionModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
                    total: { $sum: '$amountPaid' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
    }
    getModel() {
        return this.transactionModel;
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map