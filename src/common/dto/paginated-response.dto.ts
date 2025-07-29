import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty({ isArray: true })
  data: T[];
}