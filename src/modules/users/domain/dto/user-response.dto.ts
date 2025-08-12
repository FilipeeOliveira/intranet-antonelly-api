import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../auth/domain/entities/role.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Username do usuário', required: false })
  username?: string;

  @ApiProperty({ description: 'Setor do usuário', required: false })
  setor?: string;

  @ApiProperty({ description: 'Perfil do usuário', enum: RoleType })
  role: RoleType;

  @ApiProperty({ description: 'Status de ativação do usuário' })
  isActive: boolean;

  @ApiProperty({ description: 'Indica se tem senha temporária' })
  isTemporaryPassword: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'Lista de usuários' })
  data: UserResponseDto[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página atual' })
  page: number;

  @ApiProperty({ description: 'Limite por página' })
  limit: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;
}