import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class VisitHistoryQueryDto {
  @ApiProperty({
    description: 'Filtro por visitante (id ou nome)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Número da página',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Limite de registros por página',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Campo para ordenação',
    enum: ['arrivedAt', 'leftAt'],
    default: 'arrivedAt',
    required: false,
  })
  @IsOptional()
  sortBy?: string = 'arrivedAt';

  @ApiProperty({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false,
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
