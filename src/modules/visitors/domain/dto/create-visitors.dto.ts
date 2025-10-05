import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export enum VisitorStatus {
  PRESENT = 1,
  LEFT = 2,
}

export class CreateVisitorDto {
  @ApiProperty({ description: 'Nome do visitante', example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do visitante', example: 'joao@email.com', required: false })
  @ValidateIf((o) => !o.cpf && !o.cnpj)
  @IsNotEmpty({ message: 'E-mail é obrigatório quando CPF ou CNPJ não são fornecidos' })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'CPF do visitante', example: '12345678901', required: false })
  @ValidateIf((o) => !o.email && !o.cnpj)
  @IsNotEmpty({ message: 'CPF é obrigatório quando e-mail ou CNPJ não são fornecidos' })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({ description: 'CNPJ do visitante', example: '12345678000123', required: false })
  @ValidateIf((o) => !o.email && !o.cpf)
  @IsNotEmpty({ message: 'CNPJ é obrigatório quando e-mail ou CPF não são fornecidos' })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ description: 'ID da empresa do visitante', example: 'uuid-da-empresa', required: false })
  @IsOptional()
  @IsUUID()
  companieId?: string;

  @ApiProperty({ description: 'Status do visitante', enum: VisitorStatus, default: VisitorStatus.PRESENT })
  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus = VisitorStatus.PRESENT;
}
