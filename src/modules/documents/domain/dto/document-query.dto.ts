import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { DocumentStatus } from './create-document.dto';

export class DocumentQueryDto {
  @ApiProperty({
    description: 'Busca por título, descrição ou categoria',
    required: false,
    example: 'Manual de Segurança',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtro por status do documento',
    enum: DocumentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiProperty({
    description: 'Filtro por setor',
    required: false,
    example: 'RH',
  })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({
    description: 'Filtro por versão',
    required: false,
    example: '1.0',
  })
  @IsOptional()
  @IsString()
  version?: string;

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
    enum: ['title', 'category', 'department', 'status', 'version', 'createdAt'],
    default: 'title',
    required: false,
  })
  @IsOptional()
  @IsEnum(['title', 'category', 'department', 'status', 'version', 'createdAt'])
  sortBy?: string = 'title';

  @ApiProperty({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'asc',
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
