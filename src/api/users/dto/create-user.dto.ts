import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class SubjectDto {
  @ApiProperty()
  @IsString()
  subjectName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountPerHour: number;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ type: [SubjectDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects?: SubjectDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subscriberId?: string;
}
