import { ApiProperty } from '@nestjs/swagger';
import { StatusEncomenda } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListEncomendasDto {
  @ApiProperty({ enum: StatusEncomenda, required: false })
  @IsOptional()
  @IsEnum(StatusEncomenda)
  status?: StatusEncomenda;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  destinatarioEmail?: string;

  @ApiProperty({ required: false, description: 'Busca por remetente, destinatarioNome ou codigoRastreio' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ required: false, enum: ['dataRecebimento', 'createdAt', 'status'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
