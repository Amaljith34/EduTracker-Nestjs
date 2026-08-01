import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class SubjectDto {
  @ApiProperty({ description: 'Name of the subject' })
  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @ApiProperty({ description: 'Amount per hour for the subject' })
  @IsNumber()
  @Min(0)
  amountPerHour: number;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Full Name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ type: String, description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password Length must be greater than 5' })
  password: string;

  @ApiPropertyOptional({ type: [SubjectDto], description: 'Subjects the user is subscribed to' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects?: SubjectDto[];

  @ApiPropertyOptional({ type: String, description: 'Subscriber ID' })
  @IsOptional()
  @IsString()
  subscriberId?: string;
}
