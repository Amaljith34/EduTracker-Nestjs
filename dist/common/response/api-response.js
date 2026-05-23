"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseUtil = void 0;
class ApiResponseUtil {
    static success(data, message) {
        return { success: true, data, message };
    }
    static successMessage(message) {
        return { success: true, message };
    }
    static list(data, message) {
        return { success: true, data, total: data.length, message };
    }
}
exports.ApiResponseUtil = ApiResponseUtil;
//# sourceMappingURL=api-response.js.map