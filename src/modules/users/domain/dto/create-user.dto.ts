import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { RoleType } from '../../../auth/domain/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@empresa.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Username do usuário (opcional)',
    example: 'joao.silva',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Username deve ser uma string' })
  username?: string;

  @ApiProperty({
    description: 'Setor do usuário (opcional)',
    example: 'Vendas',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Setor deve ser uma string' })
  setor?: string;

  @ApiProperty({
    description: 'Perfil do usuário',
    enum: RoleType,
    example: RoleType.FUNCIONARIO,
  })
  @IsEnum(RoleType, { message: 'Perfil deve ser um dos valores válidos' })
  @IsNotEmpty({ message: 'Perfil é obrigatório' })
  role: RoleType;
}