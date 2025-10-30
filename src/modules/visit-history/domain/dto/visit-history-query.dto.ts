import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';
import { VisitHistoryStatus } from '../enums/VisitHistoryStatus';

export class VisitHistoryQueryDto {
  @ApiProperty({
    description: 'Filtro por visitante (id ou nome)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Status da visita. (1: Agendado, 2: Presente, 3: Saiu, 4: Cancelada)',
    default: VisitHistoryStatus.PRESENT,
    enum: VisitHistoryStatus,
    required: false,
  })
  @IsOptional()
  status?: VisitHistoryStatus = VisitHistoryStatus.PRESENT;

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
