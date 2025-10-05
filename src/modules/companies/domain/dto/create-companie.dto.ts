import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanieDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'ACME Corp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678000123', required: false })
  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @ApiProperty({ description: 'Descrição da empresa', example: 'Fornecedor de equipamentos', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
