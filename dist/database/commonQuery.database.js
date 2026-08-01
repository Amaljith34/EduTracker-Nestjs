"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonQueryDatabase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const types_1 = require("./types");
class CommonQueryDatabase {
    static async authUser(jwTPayload, userModel) {
        const filters = { $or: [] };
        const userId = jwTPayload?.sub ?? jwTPayload?.userId;
        const email = jwTPayload?.email;
        if (userId && (0, mongoose_1.isValidObjectId)(userId)) {
            filters.$or.push({ _id: new mongoose_1.Types.ObjectId(userId) });
        }
        if (email) {
            filters.$or.push({ email });
        }
        if (!filters.$or.length) {
            throw new common_1.UnauthorizedException('Invalid User');
        }
        const user = await userModel.findOne(filters);
        if (!user || (user?.status && user.status !== types_1.DBStatus.ACTIVE)) {
            throw new common_1.UnauthorizedException('Invalid User');
        }
        return user;
    }
    static async getCountWithFilters({ model, filters }) {
        return await model.countDocuments(filters);
    }
    static async findAllWithFilters({ model, modelName, populate, filters, options, }) {
        const data = populate
            ? await model.find(filters, undefined, options).populate(populate).lean()
            : await model.find(filters, undefined, options);
        return data;
    }
    static async findById({ id, model, modelName, populate }) {
        if (!this.isObjectId(id))
            throw new common_1.BadRequestException(`Invalid id: ${id}.`);
        const data = populate
            ? await model.findById(id).populate(populate)
            : await model.findById(id);
        if (!data)
            throw new common_1.NotFoundException(`No ${modelName} found with id ${id}.`);
        return data;
    }
    static isObjectId(id) {
        return (0, mongoose_1.isValidObjectId)(id);
    }
    static getObjectId(id) {
        return new mongoose_1.Types.ObjectId(id);
    }
}
exports.CommonQueryDatabase = CommonQueryDatabase;
//# sourceMappingURL=commonQuery.database.js.map