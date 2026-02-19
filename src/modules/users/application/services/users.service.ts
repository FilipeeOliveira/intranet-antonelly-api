import { ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from 'src/modules/auth/infrastructure/repositories/auth.repository';
import { EmailService } from 'src/modules/email/application/services/email.service';
import { PermissionsService } from 'src/modules/permissions/application/services/permissions.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RolesRepository } from 'src/modules/roles/infrastructure/repositories/roles.repository';
import { SectorService } from 'src/modules/sectors/application/services/sector.service';
import { USER_ROLES } from '../../../../shared/types/users.roles';
import { PasswordUtil } from '../../../../shared/utils/password.util';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/dto/update-user.dto';
import { UserQueryDto } from '../../domain/dto/user-query.dto';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { SendWelcomeEmailUseCase } from '../use-cases/send-welcome-email.use-case';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sectorService: SectorService,
    private readonly emailService: EmailService,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsService: PermissionsService,
    private readonly prisma: PrismaService,
    private readonly authRepository: AuthRepository,
  ) { }

  async findAll(query: UserQueryDto) {
    this.logger.log(`Buscando usuários com filtros: ${JSON.stringify(query)}`);
    return this.usersRepository.findAll(query);
  }

  async findById(id: string) {
    this.logger.log(`Buscando usuário por ID: ${id}`);
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAllBySector(sectorId: string) {
    return await this.usersRepository.findAllBySector(sectorId);
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Criando novo usuário: ${createUserDto.email}`);

    // Verificar se email já existe
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Verificar se username já existe (se fornecido)
    if (createUserDto.username) {
      const existingUsername = await this.usersRepository.findByUsername(createUserDto.username);
      if (existingUsername) {
        throw new ConflictException('Username já está em uso');
      }
    }

    // Bloquear criação de usuário com role SUPERADMIN
    if (createUserDto.role === USER_ROLES.SUPERADMIN) {
      throw new ForbiddenException('Não é possível criar um usuário com o cargo de Super Administrador.');
    }

    // Verificar se setor já existe
    const sectorExists = await this.sectorService.findById(createUserDto.sectorId);
    if (!sectorExists) {
      throw new NotFoundException('Setor não encontrado');
    }

    // Gerar senha temporária
    const temporaryPassword = PasswordUtil.generateTemporaryPassword();
    this.logger.log(`Senha temporária gerada para ${createUserDto.email}`);

    // Hash da senha temporária
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Criar usuário no banco
    const user = await this.usersRepository.create(createUserDto, hashedPassword);

    const roleFeatures = await this.rolesRepository.getRoleFeatures(user?.roleId || user?.role?.id);
    const featureIds = roleFeatures.map((rf) => rf.featureId);

    await this.permissionsService.assignManyFeatures(user.id, featureIds);

    // Enviar email de boas-vindas com senha temporária (fire-and-forget com log de falha)
    // Em caso de falha, o admin pode usar "Resetar Senha" para reenviar as credenciais
    void this.sendWelcomeEmailUseCase.execute({
      to: user.email,
      context: {
        name: user.name,
        email: user.email,
        temporaryPassword,
      }
    }).catch(err =>
      this.logger.error(`Falha ao enviar email de boas-vindas para ${user.email}: ${err?.message}`)
    );

    this.logger.log(`Usuário criado com sucesso: ${user.email}`);

    // Retornar dados sem senha
    const { password, ...userWithoutPassword } = user;
    return {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      sector: userWithoutPassword.sector,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: user.role,
    };
  }

  async changeUserRole(userId: string, oldRoleId: string, newRoleId: string) {
    // features da role antiga
    const oldRoleFeatures = await this.rolesRepository.getRoleFeatures(oldRoleId);
    const oldFeatureIds = oldRoleFeatures.map((rf) => rf.featureId);

    // remove apenas as features da role antiga
    await this.permissionsService.revokeManyFeatures(userId, oldFeatureIds);

    // features da nova role
    const newRoleFeatures = await this.rolesRepository.getRoleFeatures(newRoleId);
    const newFeatureIds = newRoleFeatures.map((rf) => rf.featureId);

    // adiciona novas
    await this.permissionsService.assignManyFeatures(userId, newFeatureIds);
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Atualizando usuário: ${id}`);

    const existingUser = await this.findById(id);

    if (updateUserDto.sectorId) {
      const sectorExists = await this.sectorService.findById(updateUserDto.sectorId);
      if (!sectorExists) {
        throw new NotFoundException('Setor não encontrado');
      }
    }

    if (updateUserDto.role) {
      // Bloquear alteração de role do SUPERADMIN
      if (existingUser.role?.key === USER_ROLES.SUPERADMIN) {
        throw new ForbiddenException('Não é possível alterar o cargo do Super Administrador.');
      }

      // Bloquear atribuição do role SUPERADMIN a qualquer usuário
      if (updateUserDto.role === USER_ROLES.SUPERADMIN) {
        throw new ForbiddenException('Não é possível atribuir o cargo de Super Administrador.');
      }

      const role = await this.prisma.role.findUnique({
        where: { key: updateUserDto.role },
      });

      if (!role) {
        throw new Error(`Role ${updateUserDto.role} não encontrada`);
      }

      await this.changeUserRole(id, existingUser.role.id, role.id);

      existingUser.role = role;
      (updateUserDto as any).roleId = role.id;
      delete updateUserDto.role;
    }

    // Verificar conflito de email se estiver sendo alterado
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.usersRepository.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Verificar conflito de username se estiver sendo alterado
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const usernameExists = await this.usersRepository.findByUsername(updateUserDto.username);
      if (usernameExists) {
        throw new ConflictException('Username já está em uso');
      }
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);

    this.logger.log(`Usuário atualizado: ${id}`);

    const { password, ...userWithoutPassword } = updatedUser;
    return {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      sector: userWithoutPassword.sector,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: updatedUser.role as any,
    };
  }

  async resetPassword(id: string) {
    this.logger.log(`Resetando senha do usuário: ${id}`);

    const user = await this.findById(id);

    if (user.role?.key === USER_ROLES.SUPERADMIN) {
      throw new ForbiddenException('Não é possível resetar a senha do Super Administrador.');
    }

    // Gerar nova senha temporária
    const temporaryPassword = PasswordUtil.generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Atualizar senha no banco
    await this.usersRepository.updatePassword(id, hashedPassword, true);

    // Enviar email com nova senha temporária (fire-and-forget — erros tratados internamente pelo EmailService)
    this.emailService.sendResetPasswordEmail(user.email, {
      name: user.name,
      email: user.email,
      temporaryPassword,
    });

    // Invalidar todos os tokens ativos do usuário (limpa blacklist antiga)
    await this.authRepository.invalidateAllUserTokens(id);
    this.logger.log(`Tokens do usuário ${id} invalidados`);

    this.logger.log(`Senha resetada para usuário: ${user.email}`);

    return {
      message: 'Senha resetada com sucesso. Nova senha temporária enviada por email.',
    };
  }

  async toggleStatus(id: string) {
    this.logger.log(`Alternando status do usuário: ${id}`);

    const user = await this.findById(id);
    if (user.role?.key === USER_ROLES.SUPERADMIN) {
      throw new ForbiddenException('Não é possível alterar o status do Super Administrador.');
    }

    const updatedUser = await this.usersRepository.toggleUserStatus(id);

    // Se usuário foi desativado, invalidar tokens
    if (!updatedUser.isActive) {
      await this.authRepository.invalidateAllUserTokens(id);
      this.logger.log(`Usuário desativado, tokens invalidados: ${id}`);
    }

    this.logger.log(`Status do usuário alterado: ${id} - Ativo: ${updatedUser.isActive}`);

    const { password, ...userWithoutPassword } = updatedUser;
    return {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      sector: userWithoutPassword.sector,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: updatedUser.role.key as any,
    };
  }

  async remove(id: string) {
    this.logger.log(`Removendo usuário: ${id}`);

    const user = await this.findById(id);
    if (user.role?.key === USER_ROLES.SUPERADMIN) {
      throw new ForbiddenException('Não é possível remover o Super Administrador.');
    }

    await this.usersRepository.delete(id);

    this.logger.log(`Usuário removido: ${id}`);

    return {
      message: 'Usuário removido com sucesso',
    };
  }
}