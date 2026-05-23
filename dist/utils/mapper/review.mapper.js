"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMapper = void 0;
class ReviewMapper {
    static toResponse(r) {
        return {
            id: r._id.toString(),
            userId: r.userId?.toString(),
            subscriberId: r.subscriberId?.toString(),
            subjectName: r.subjectName,
            amountPerHour: r.amountPerHour,
            hours: r.hours,
            calculatedAmount: r.calculatedAmount,
            finalAmount: r.finalAmount,
            date: r.date instanceof Date ? r.date.toISOString() : r.date,
            notes: r.notes,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        };
    }
    static toResponseList(rows) {
        return rows.map((r) => ReviewMapper.toResponse(r));
    }
}
exports.ReviewMapper = ReviewMapper;
//# sourceMappingURL=review.mapper.js.map