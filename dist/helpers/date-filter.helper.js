"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeMatch = exports.resolveDateRange = exports.parseLocalDate = void 0;
const parseLocalDate = (value, endOfDay = false) => {
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (dateOnly) {
        const year = Number(dateOnly[1]);
        const month = Number(dateOnly[2]) - 1;
        const day = Number(dateOnly[3]);
        if (endOfDay) {
            return new Date(year, month, day, 23, 59, 59, 999);
        }
        return new Date(year, month, day, 0, 0, 0, 0);
    }
    const d = new Date(value);
    if (endOfDay)
        d.setHours(23, 59, 59, 999);
    return d;
};
exports.parseLocalDate = parseLocalDate;
const resolveDateRange = (query) => {
    const now = new Date();
    let fromDate = query.fromDate ? (0, exports.parseLocalDate)(query.fromDate, false) : undefined;
    let toDate = query.toDate ? (0, exports.parseLocalDate)(query.toDate, true) : undefined;
    const hasCustomRange = Boolean(query.fromDate || query.toDate);
    if (!hasCustomRange && query.period === 'week') {
        const start = new Date(now);
        const day = start.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        start.setDate(start.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);
        fromDate = start;
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
    }
    else if (!hasCustomRange && query.period === 'month') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
    }
    else if (!hasCustomRange && query.period === 'year') {
        fromDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        toDate = new Date(now);
        toDate.setHours(23, 59, 59, 999);
    }
    if (toDate && !query.toDate) {
    }
    else if (toDate && query.toDate) {
    }
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