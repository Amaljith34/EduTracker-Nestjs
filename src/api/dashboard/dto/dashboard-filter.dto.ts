import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DateFilterQuery } from 'src/helpers/date-filter.helper';

export class DashboardFilterDto implements DateFilterQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ enum: ['week', 'month', 'year'] })
  @IsOptional()
  @IsString()
  period?: 'week' | 'month' | 'year';
}
