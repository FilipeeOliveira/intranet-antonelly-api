import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { VisitorStatus } from './create-visitors.dto';

export class VisitorsQueryDto {
  @ApiProperty({
    description: 'Busca por nome ou email',
    required: false,
    example: 'João',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtro por status',
    enum: VisitorStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @ApiProperty({
    description: 'Filtro por empresa (ID)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  companieId?: string;

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
    enum: ['name', 'email', 'status', 'arrivedAt', 'leftAt', 'createdAt'],
    default: 'arrivedAt',
    required: false,
  })
  @IsOptional()
  sortBy?: string = 'arrivedAt';

  @ApiProperty({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'asc',
    required: false,
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}
