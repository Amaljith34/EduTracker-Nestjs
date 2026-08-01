import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DBStatus } from 'src/database/types';

class SubjectDto {
  @ApiPropertyOptional({ description: 'Name of the subject' })
  @IsOptional()
  @IsString()
  subjectName?: string;

  @ApiPropertyOptional({ description: 'Amount per hour for the subject' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPerHour?: number;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Full Name of the user' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Email of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Password of the user' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password Length must be greater than 5' })
  password?: string;

  @ApiPropertyOptional({ type: [SubjectDto], description: 'Subjects the user is subscribed to' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects?: SubjectDto[];

  @ApiPropertyOptional({ description: 'Status of the user', enum: DBStatus })
  @IsOptional()
  @IsEnum(DBStatus)
  status?: DBStatus;
}
