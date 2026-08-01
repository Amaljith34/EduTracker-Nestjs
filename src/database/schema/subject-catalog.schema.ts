import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum SubjectStatus {
  ACTIVE = 'active',
  HOLD = 'hold',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export type SubjectCatalogDocument = SubjectCatalog & Document;

@Schema({ timestamps: true, collection: 'subjects' })
export class SubjectCatalog {
  @Prop({ required: true, trim: true, lowercase: true })
  subjectName: string;

  @Prop({
    required: true,
    type: String,
    enum: SubjectStatus,
    default: SubjectStatus.ACTIVE,
  })
  status: SubjectStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false, index: true })
  createdBy?: Types.ObjectId;

  @Prop({ type: String, required: false })
  createdByName?: string;

  @Prop({ type: String, required: false })
  createdByType?: string;
}

export const SubjectCatalogSchema = SchemaFactory.createForClass(SubjectCatalog);
// Unique index among non-deleted subjects is managed in IndexSyncService.
