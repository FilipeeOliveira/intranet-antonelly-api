import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { Role, RoleType } from '../../domain/entities/role.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        permissions: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!userData) {
      return null;
    }

    return this.mapToUserEntity(userData);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
        permissions: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!userData) {
      return null;
    }

    return this.mapToUserEntity(userData);
  }

  async findUserById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        permissions: {
          include: {
            feature: true
          }
        },
      },
    });

    if (!userData) {
      return null;
    }

    return this.mapToUserEntity(userData);
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async blacklistToken(token: string, userId: string, expiresAt: Date): Promise<void> {
    await this.prisma.blacklistedToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.prisma.blacklistedToken.findFirst({
      where: {
        token,
        expiresAt: {
          gte: new Date(), // Token ainda não expirou
        },
      },
    });

    return !!blacklistedToken;
  }

  async updateTemporaryPasswordFlag(userId: string, isTemporary: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isTemporaryPassword: isTemporary },
    });
  }

  /**
   * Remove todos os tokens da blacklist de um usuário específico.
   * Isso é útil quando o admin reseta a senha - todos os tokens anteriores
   * devem ser considerados inválidos, mas como usamos blacklist,
   * na prática o que importa é que o usuário precisará fazer login novamente.
   *
   * Nota: Em um sistema com blacklist, os tokens antigos ainda serão válidos
   * até expirarem. Para uma invalidação imediata, seria necessário manter
   * uma versão de senha/token no payload JWT ou usar um cache Redis.
   */
  async invalidateAllUserTokens(userId: string): Promise<void> {
    // Remove tokens antigos da blacklist deste usuário (limpeza)
    await this.prisma.blacklistedToken.deleteMany({
      where: { userId },
    });
  }

  private mapToUserEntity(userData: any): User {
    const role = new Role(
      userData.role.id,
      userData.role.key as RoleType,
      userData.role.description,
      userData.role.createdAt,
      userData.role.updatedAt,
    );

    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.username,
      userData.password,
      userData.setor,
      userData.roleId,
      userData.isActive,
      userData.isTemporaryPassword,
      role,
      userData.permissions ? userData.permissions : [],
      userData.createdAt,
      userData.updatedAt,
    );
  }
}