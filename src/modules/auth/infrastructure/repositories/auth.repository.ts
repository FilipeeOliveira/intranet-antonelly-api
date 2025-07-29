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
      },
    });

    if (!userData) {
      return null;
    }

    return this.mapToUserEntity(userData);
  }

  private mapToUserEntity(userData: any): User {
    const role = new Role(
      userData.role.id,
      userData.role.name as RoleType,
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
      role,
      userData.createdAt,
      userData.updatedAt,
    );
  }
}