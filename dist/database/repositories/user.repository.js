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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schema/user.schema");
const auth_type_1 = require("../../api/auth/auth.type");
const types_1 = require("../types");
const pagination_helper_1 = require("../../helpers/pagination.helper");
let UserRepository = class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    findByEmail(email, type) {
        const filter = {
            email: email.trim().toLowerCase(),
            status: { $ne: types_1.DBStatus.DELETED },
        };
        if (type)
            filter.type = type;
        return this.userModel.findOne(filter).select('+password +refreshToken');
    }
    findByEmailIncludingDeleted(email) {
        return this.userModel
            .findOne({ email: email.trim().toLowerCase() })
            .select('+password +refreshToken');
    }
    findById(id) {
        return this.userModel.findById(id);
    }
    findByIds(ids) {
        return this.userModel.find({ _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) } });
    }
    findByIdWithRefresh(id) {
        return this.userModel.findById(id).select('+refreshToken');
    }
    create(data) {
        return this.userModel.create(data);
    }
    updateRefreshToken(id, token) {
        return this.userModel.findByIdAndUpdate(id, { refreshToken: token });
    }
    getModel() {
        return this.userModel;
    }
    async findPaginated(filter, query, search) {
        const { page, limit, skip, sort } = (0, pagination_helper_1.getPagination)(query);
        const mongoFilter = { ...filter };
        if (search) {
            mongoFilter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.userModel.find(mongoFilter).sort(sort).skip(skip).limit(limit),
            this.userModel.countDocuments(mongoFilter),
        ]);
        return { data, total, page, limit };
    }
    findEndUsersBySubscriber(subscriberId) {
        return this.userModel.find({
            type: auth_type_1.UserType.USER,
            subscriberId: new mongoose_2.Types.ObjectId(subscriberId),
            status: { $ne: types_1.DBStatus.DELETED },
        });
    }
    updateById(id, data) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }
    softDelete(id) {
        return this.userModel.findByIdAndUpdate(id, { status: types_1.DBStatus.DELETED });
    }
    countByType(type, extra = {}) {
        return this.userModel.countDocuments({
            type,
            status: { $ne: types_1.DBStatus.DELETED },
            ...extra,
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepository);
//# sourceMappingURL=user.repository.js.map