import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../entities/role.entity';

export class UserProfileDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Username do usuário', required: false })
  username?: string;

  @ApiProperty({ description: 'Setor do usuário', required: false })
  setor?: string;

  @ApiProperty({ description: 'Cargo do usuário', enum: RoleType })
  role: RoleType;

  @ApiProperty({
    description: 'Permissões do usuário',
    isArray: true,
    required: false,
  })
  permissions?: string[];

  @ApiProperty({
    description: 'Indica se o usuário está usando uma senha temporária e precisa alterá-la',
    required: false,
  })
  isTemporaryPassword?: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  access_token: string;

  @ApiProperty({
    description: 'Informações do usuário autenticado',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}