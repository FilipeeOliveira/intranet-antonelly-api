import { IsOptional, IsInt, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage: number = 15;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir: 'asc' | 'desc' = 'asc';
}
