import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DateFilterQuery } from 'src/helpers/date-filter.helper';
import { PaginationQuery } from 'src/helpers/pagination.helper';

export class FilterReviewDto implements PaginationQuery, DateFilterQuery {
  @ApiPropertyOptional()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjectName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ enum: ['all', 'lastMonth', 'month', 'year'] })
  @IsOptional()
  @IsString()
  period?: 'all' | 'lastMonth' | 'month' | 'year';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
