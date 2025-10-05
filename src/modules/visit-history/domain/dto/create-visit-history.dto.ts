import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVisitHistoryDto {
  @ApiProperty({ description: 'ID do visitante', example: 'uuid-do-visitante' })
  @IsNotEmpty()
  @IsString()
  visitorId: string;

  @ApiProperty({
    description: 'Descrição do motivo da visita',
    example: 'Reunião com o departamento de vendas',
    required: true,
  })
  description: string;

  @ApiProperty({ description: 'Data e hora de entrada', example: '2025-09-28T10:00:00Z', required: false })
  @IsOptional()
  arrivedAt?: Date;

  @ApiProperty({ description: 'Data e hora de saída', example: '2025-09-28T12:30:00Z', required: false })
  @IsOptional()
  leftAt?: Date;
}
