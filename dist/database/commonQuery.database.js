"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonQueryDatabase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const types_1 = require("./types");
class CommonQueryDatabase {
    static async authUser(jwtPayload, userModel) {
        const filters = { $or: [] };
        const userId = jwtPayload?.sub ?? jwtPayload?.userId;
        const email = jwtPayload?.email;
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
}
exports.CommonQueryDatabase = CommonQueryDatabase;
//# sourceMappingURL=commonQuery.database.js.map