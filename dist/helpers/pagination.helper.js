"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginated = exports.getPagination = void 0;
const getPagination = (query) => {
    const page = Math.max(1, parseInt(String(query.page || 1), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 10), 10)));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    return { page, limit, skip, sort: { [sortBy]: sortOrder } };
};
exports.getPagination = getPagination;
const paginated = (data, total, page, limit) => ({
    data,
    pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
    },
});
exports.paginated = paginated;
//# sourceMappingURL=pagination.helper.js.map