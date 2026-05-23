import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** Subject + rate embedded on end-user documents */
@Schema({ _id: false })
export class UserSubject {
  @Prop({ required: true, trim: true })
  subjectName: string;

  @Prop({ required: true, min: 0 })
  amountPerHour: number;
}

export const UserSubjectSchema = SchemaFactory.createForClass(UserSubject);
