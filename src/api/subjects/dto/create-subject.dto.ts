import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { SubjectStatus } from 'src/database/schema/subject-catalog.schema';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @MinLength(2)
  subjectName: string;

  @ApiPropertyOptional({ enum: SubjectStatus, default: SubjectStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SubjectStatus)
  status?: SubjectStatus;
}
