import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RegistrarDevolucaoDto {
  @ApiProperty({ required: false, description: 'Motivo ou observação da devolução' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
