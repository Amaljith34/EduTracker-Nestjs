"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbHelpers = void 0;
const common_1 = require("@nestjs/common");
const data_validator_1 = require("../../validator/data.validator");
const helperFunction_utils_1 = require("../../../helpers/helperFunction.utils");
class DbHelpers {
    static assertObjectId(id, label = 'id') {
        if (!data_validator_1.DataValidator.isObjectId(id)) {
            throw new common_1.BadRequestException(`Invalid ${label}: ${id}`);
        }
    }
    static async findById({ id, model, populate, filters, modelName = 'Record', }) {
        this.assertObjectId(id);
        const query = model.findOne({ _id: id, ...filters });
        const data = populate
            ? await query.populate(populate)
            : await query;
        if (!data) {
            throw new common_1.NotFoundException(`No ${modelName} found with id ${id}.`);
        }
        return data;
    }
    static async findAll({ model, filters, options, pagination, sort, }) {
        const { limit, skip } = helperFunction_utils_1.HelperFunctionUtils.getPaginationParams(pagination ?? {});
        return model.find(filters, undefined, options).sort(sort).limit(limit).skip(skip);
    }
    static monthDateRange(month, year) {
        const pad = (n) => String(n).padStart(2, '0');
        const lastDay = new Date(year, month, 0).getDate();
        return {
            from: `${year}-${pad(month)}-01`,
            to: `${year}-${pad(month)}-${lastDay}`,
        };
    }
}
exports.DbHelpers = DbHelpers;
//# sourceMappingURL=db.helpers.js.map