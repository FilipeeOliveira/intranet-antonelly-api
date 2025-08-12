import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RoleType } from '../../../auth/domain/entities/role.entity';

export class UserQueryDto {
  @ApiProperty({
    description: 'Busca por nome ou email',
    required: false,
    example: 'João',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtro por perfil',
    enum: RoleType,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;

  @ApiProperty({
    description: 'Filtro por setor',
    required: false,
    example: 'Vendas',
  })
  @IsOptional()
  @IsString()
  setor?: string;

  @ApiProperty({
    description: 'Filtro por status ativo',
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

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
    enum: ['name', 'email', 'createdAt', 'role'],
    default: 'name',
    required: false,
  })
  @IsOptional()
  @IsEnum(['name', 'email', 'createdAt', 'role'])
  sortBy?: string = 'name';

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