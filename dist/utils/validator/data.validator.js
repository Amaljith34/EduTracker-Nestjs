"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValidator = void 0;
const mongoose_1 = require("mongoose");
class DataValidator {
    static isObjectId(id) {
        return (0, mongoose_1.isValidObjectId)(id);
    }
}
exports.DataValidator = DataValidator;
//# sourceMappingURL=data.validator.js.map