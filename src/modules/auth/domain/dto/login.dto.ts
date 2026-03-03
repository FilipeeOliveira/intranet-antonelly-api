import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email ou username do usuário',
    example: 'superadmin',
  })
  @IsString({ message: 'Identificador deve ser uma string' })
  @IsNotEmpty({ message: 'Email ou username é obrigatório' })
  identifier: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'admin123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  password: string;
}
