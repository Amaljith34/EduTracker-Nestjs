"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperFunctionUtils = void 0;
const bcrypt = require("bcrypt");
class HelperFunctionUtils {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
    static async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    static getPaginationParams(data) {
        const limit = data.limit ?? 10;
        const page = data.page ?? 1;
        return { limit, skip: (page - 1) * limit };
    }
}
exports.HelperFunctionUtils = HelperFunctionUtils;
//# sourceMappingURL=helperFunction.utils.js.map