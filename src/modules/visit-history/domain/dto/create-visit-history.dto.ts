import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVisitHistoryDto {

  @ApiProperty({
    description: 'Nome do visitante',
    example: 'João da Silva',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  visitorName: string;

  @ApiProperty({
    description: 'CPF do visitante',
    example: '12345678900',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  visitorCpf: string;

  @ApiProperty({
    description: 'Telefone do visitante',
    example: '11987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  visitorPhone: string;

  @ApiProperty({
    description: 'ID da empresa que está sendo visitada',
    example: 'e2e47e4f-cc59-44b8-9b7f-247b3e3e4af8',
  })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

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
