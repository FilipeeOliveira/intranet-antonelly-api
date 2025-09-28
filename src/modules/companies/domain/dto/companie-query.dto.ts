import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class CompanieQueryDto {
  @ApiProperty({ description: 'Filtro por nome', required: false, example: 'ACME' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Número da página', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Limite por página', default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ description: 'Campo para ordenação', enum: ['name', 'createdAt'], default: 'name', required: false })
  @IsOptional()
  sortBy: string = 'name';

  @ApiProperty({ description: 'Direção da ordenação', enum: ['asc', 'desc'], default: 'asc', required: false })
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'asc';
}
