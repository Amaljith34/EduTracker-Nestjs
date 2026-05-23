import { ReviewDocument } from 'src/database/schema/review.schema';

export class ReviewMapper {
  static toResponse(r: ReviewDocument) {
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
      createdAt: (r as { createdAt?: Date }).createdAt,
      updatedAt: (r as { updatedAt?: Date }).updatedAt,
    };
  }

  static toResponseList(rows: ReviewDocument[]) {
    return rows.map((r) => ReviewMapper.toResponse(r));
  }
}
