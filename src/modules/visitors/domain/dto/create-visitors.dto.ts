import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum VisitorStatus {
  PRESENT = 'PRESENT',
  LEFT = 'LEFT',
}

export class CreateVisitorDto {
  @ApiProperty({ description: 'Nome do visitante', example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do visitante', example: 'joao@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID da empresa do visitante', example: 'uuid-da-empresa', required: false })
  @IsOptional()
  @IsUUID()
  companieId?: string;

  @ApiProperty({ description: 'Status do visitante', enum: VisitorStatus, default: VisitorStatus.PRESENT })
  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus = VisitorStatus.PRESENT;
}
