import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserType } from 'src/api/auth/auth.type';
import { DBStatus } from '../types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ type: String, trim: true, required: false })
  phone?: string;

  @Prop({ required: true, select: false })
  @Exclude()
  password: string;

  @Prop({ required: true, type: String, enum: UserType, default: UserType.USER })
  type: UserType;

  @Prop({ type: String, enum: DBStatus, default: DBStatus.ACTIVE })
  status: DBStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true, required: false })
  subscriberId?: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
  subscriberIds?: Types.ObjectId[];

  @Prop({
    type: [
      {
        subjectName: { type: String, required: true, trim: true },
        amountPerHour: { type: Number, required: true, min: 0 },
      },
    ],
    required: false,
    default: [],
  })
  subjects: {
    subjectName: string;
    amountPerHour: number;
  }[];

  @Prop({ type: String, select: false, required: false })
  @Exclude()
  refreshToken?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ subscriberId: 1, email: 1 });
