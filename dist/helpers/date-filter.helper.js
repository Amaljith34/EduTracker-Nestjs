"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeMatch = exports.resolveDateRange = void 0;
const resolveDateRange = (query) => {
    const now = new Date();
    let fromDate = query.fromDate ? new Date(query.fromDate) : undefined;
    let toDate = query.toDate ? new Date(query.toDate) : undefined;
    if (query.period === 'week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        fromDate = start;
        toDate = now;
    }
    else if (query.period === 'month') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate = now;
    }
    else if (query.period === 'year') {
        fromDate = new Date(now.getFullYear(), 0, 1);
        toDate = now;
    }
    if (toDate)
        toDate.setHours(23, 59, 59, 999);
    return { fromDate, toDate };
};
exports.resolveDateRange = resolveDateRange;
const dateRangeMatch = (field, fromDate, toDate) => {
    if (!fromDate && !toDate)
        return {};
    const range = {};
    if (fromDate)
        range.$gte = fromDate;
    if (toDate)
        range.$lte = toDate;
    return { [field]: range };
};
exports.dateRangeMatch = dateRangeMatch;
//# sourceMappingURL=date-filter.helper.js.map