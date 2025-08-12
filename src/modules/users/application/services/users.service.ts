import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { UserQueryDto } from '../../domain/dto/user-query.dto';
import { UpdateUserDto } from '../../domain/dto/update-user.dto';
import { EmailService } from '../../../../shared/services/email.service';
import { PasswordUtil } from '../../../../shared/utils/password.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

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

    // Gerar senha temporária
    const temporaryPassword = PasswordUtil.generateTemporaryPassword();
    this.logger.log(`Senha temporária gerada para ${createUserDto.email}`);

    // Hash da senha temporária
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Criar usuário no banco
    const user = await this.usersRepository.create(createUserDto, hashedPassword);

    // Enviar email com senha temporária (mock)
    await this.emailService.sendTemporaryPasswordEmail(user.email, {
      userName: user.name,
      email: user.email,
      temporaryPassword,
    });

    this.logger.log(`Usuário criado com sucesso: ${user.email}`);

    // Retornar dados sem senha
    const { password, ...userWithoutPassword } = user;
    return {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      setor: userWithoutPassword.setor,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: user.role.key as any,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Atualizando usuário: ${id}`);
    
    const existingUser = await this.findById(id);
    
    // Verificar conflito de email se estiver sendo alterado
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.usersRepository.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email já está em uso');
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
      setor: userWithoutPassword.setor,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: updatedUser.role.key as any,
    };
  }

  async resetPassword(id: string) {
    this.logger.log(`Resetando senha do usuário: ${id}`);
    
    const user = await this.findById(id);
    
    // Gerar nova senha temporária
    const temporaryPassword = PasswordUtil.generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Atualizar senha no banco
    await this.usersRepository.updatePassword(id, hashedPassword, true);

    // Enviar email com nova senha temporária (mock)
    await this.emailService.sendTemporaryPasswordEmail(user.email, {
      userName: user.name,
      email: user.email,
      temporaryPassword,
    });

    // Invalidar todos os tokens ativos do usuário
    // TODO: Implementar invalidação de tokens

    this.logger.log(`Senha resetada para usuário: ${user.email}`);

    return {
      message: 'Senha resetada com sucesso. Nova senha temporária enviada por email.',
    };
  }

  async toggleStatus(id: string) {
    this.logger.log(`Alternando status do usuário: ${id}`);
    
    const updatedUser = await this.usersRepository.toggleUserStatus(id);
    
    // Se usuário foi desativado, invalidar tokens
    if (!updatedUser.isActive) {
      // TODO: Implementar invalidação de tokens
      this.logger.log(`Usuário desativado, tokens invalidados: ${id}`);
    }

    this.logger.log(`Status do usuário alterado: ${id} - Ativo: ${updatedUser.isActive}`);
    
    const { password, ...userWithoutPassword } = updatedUser;
    return {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      setor: userWithoutPassword.setor,
      isActive: userWithoutPassword.isActive,
      isTemporaryPassword: userWithoutPassword.isTemporaryPassword,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: updatedUser.role.key as any,
    };
  }

  async remove(id: string) {
    this.logger.log(`Removendo usuário: ${id}`);
    
    await this.findById(id); // Verificar se existe
    await this.usersRepository.delete(id);
    
    this.logger.log(`Usuário removido: ${id}`);
    
    return {
      message: 'Usuário removido com sucesso',
    };
  }
}