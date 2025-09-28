import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanieDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'ACME Corp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da empresa', example: 'Fornecedor de equipamentos', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
