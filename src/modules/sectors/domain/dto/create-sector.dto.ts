import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSectorDto {
  @ApiProperty({ description: 'Nome do setor', example: 'Recursos Humanos' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição do setor', example: 'Responsável por gestão de pessoas', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
