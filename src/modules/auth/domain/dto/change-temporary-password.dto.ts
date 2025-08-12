import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangeTemporaryPasswordDto {
  @ApiProperty({
    description: 'Senha temporária atual',
    example: 'TempPass@123',
  })
  @IsString({ message: 'Senha temporária deve ser uma string' })
  @IsNotEmpty({ message: 'Senha temporária é obrigatória' })
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha permanente do usuário',
    example: 'MinhaNovaSenh@123',
    minLength: 8,
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'MinhaNovaSenh@123',
  })
  @IsString({ message: 'Confirmação deve ser uma string' })
  @IsNotEmpty({ message: 'Confirmação da senha é obrigatória' })
  confirmPassword: string;
}