import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  subscriberId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amountPaid: number;

  @Prop({ required: true, type: Date, index: true })
  paymentDate: Date;

  @Prop({ trim: true, default: '' })
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ subscriberId: 1, paymentDate: -1 });
TransactionSchema.index({ userId: 1, paymentDate: -1 });
