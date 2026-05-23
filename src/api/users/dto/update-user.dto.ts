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
  @ApiPropertyOptional()
  @IsString()
  subjectName: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  amountPerHour: number;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ type: [SubjectDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects?: SubjectDto[];

  @ApiPropertyOptional({ enum: DBStatus })
  @IsOptional()
  @IsEnum(DBStatus)
  status?: DBStatus;
}
