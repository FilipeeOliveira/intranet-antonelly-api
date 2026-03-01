import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';
import moment from 'moment';
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
    description: 'Data da visita no formato AAAA-MM-DD',
    example: moment().format('YYYY-MM-DD'),
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Data deve ser uma string no formato AAAA-MM-DD' })
  date?: string;

  @ApiProperty({
    description: 'Hora da visita no formato HH:mm',
    example: moment().format('HH:mm'),
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hora deve ser uma string no formato HH:mm' })
  time?: string;

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
    enum: ['arrivedAt', 'leftAt', 'createdAt'],
    required: false,
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
