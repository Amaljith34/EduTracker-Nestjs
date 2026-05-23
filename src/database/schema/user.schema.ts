import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { UserType } from 'src/api/auth/auth.type';
import { DBStatus } from '../types';
import { UserSubject, UserSubjectSchema } from './user-subject.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, type: String, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ required: true, select: false })
  @Exclude()
  password: string;

  @Prop({ required: true, type: String, enum: UserType, default: UserType.USER })
  type: UserType;

  @Prop({ type: String, enum: DBStatus, default: DBStatus.ACTIVE })
  status: DBStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  subscriberId?: Types.ObjectId;

  @Prop({ type: [UserSubjectSchema], default: [] })
  subjects: UserSubject[];

  @Prop({ select: false })
  @Exclude()
  refreshToken?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ subscriberId: 1, email: 1 });
