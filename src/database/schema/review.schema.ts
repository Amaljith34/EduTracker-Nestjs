import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { RecordStatus } from '../types';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  subscriberId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  subjectName: string;

  @Prop({ required: true, min: 0 })
  amountPerHour: number;

  @Prop({ required: true, min: 0.25 })
  hours: number;

  @Prop({ required: true, min: 0 })
  calculatedAmount: number;

  @Prop({ required: true, min: 0 })
  finalAmount: number;

  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ trim: true, default: '' })
  notes?: string;

  @Prop({
    type: String,
    enum: RecordStatus,
    default: RecordStatus.APPROVED,
    index: true,
  })
  status: RecordStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ subscriberId: 1, date: -1 });
ReviewSchema.index({ userId: 1, date: -1 });
ReviewSchema.index({ subjectName: 1, date: -1 });
