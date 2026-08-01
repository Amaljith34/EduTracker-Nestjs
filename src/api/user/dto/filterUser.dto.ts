import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DBStatus } from 'src/database/types';

export class FilterUserDto {
  @ApiPropertyOptional({ description: 'Search term for user name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by subscriber ID' })
  @IsOptional()
  @IsString()
  subscriberId?: string;

  @ApiPropertyOptional({ enum: DBStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(DBStatus)
  status?: DBStatus;
}
