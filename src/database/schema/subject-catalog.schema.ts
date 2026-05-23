import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SubjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type SubjectCatalogDocument = SubjectCatalog & Document;

@Schema({ timestamps: true, collection: 'subjects' })
export class SubjectCatalog {
  @Prop({ required: true, trim: true, unique: true, lowercase: true })
  subjectName: string;

  @Prop({
    required: true,
    type: String,
    enum: SubjectStatus,
    default: SubjectStatus.ACTIVE,
  })
  status: SubjectStatus;
}

export const SubjectCatalogSchema = SchemaFactory.createForClass(SubjectCatalog);

// Case-insensitive unique index on normalized name
SubjectCatalogSchema.index(
  { subjectName: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);
