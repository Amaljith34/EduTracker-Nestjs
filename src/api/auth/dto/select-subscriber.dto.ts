import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SelectSubscriberDto {
  @IsMongoId()
  @IsNotEmpty()
  subscriberId: string;
}
