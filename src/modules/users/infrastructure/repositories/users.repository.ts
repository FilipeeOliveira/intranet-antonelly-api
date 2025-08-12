import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { UserQueryDto } from '../../domain/dto/user-query.dto';
import { UserResponseDto } from '../../domain/dto/user-response.dto';
import { RoleType } from '../../../auth/domain/entities/role.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    const { page, limit, search, role, setor, isActive, sortBy, sortOrder } = query;
    
    const skip = (page - 1) * limit;
    
    // Construir filtros
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = { key: role };
    }
    
    if (setor) {
      where.setor = { contains: setor, mode: 'insensitive' };
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Construir ordenação
    const orderBy: any = {};
    if (sortBy === 'role') {
      orderBy.role = { key: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          role: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        setor: user.setor,
        isActive: user.isActive,
        isTemporaryPassword: user.isTemporaryPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role.key as RoleType,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      setor: user.setor,
      isActive: user.isActive,
      isTemporaryPassword: user.isTemporaryPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role.key as RoleType,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });
  }

  async create(createUserDto: CreateUserDto, hashedPassword: string) {
    // Buscar roleId pelo RoleType
    const role = await this.prisma.role.findUnique({
      where: { key: createUserDto.role },
    });

    if (!role) {
      throw new Error(`Role ${createUserDto.role} não encontrada`);
    }

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        username: createUserDto.username,
        setor: createUserDto.setor,
        password: hashedPassword,
        roleId: role.id,
        isTemporaryPassword: true,
      },
      include: {
        role: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateUserDto>) {
    const updateData: any = { ...data };
    
    // Se role foi fornecido, buscar o roleId correspondente
    if (data.role) {
      const role = await this.prisma.role.findUnique({
        where: { key: data.role },
      });
      
      if (!role) {
        throw new Error(`Role ${data.role} não encontrada`);
      }
      
      updateData.roleId = role.id;
      delete updateData.role;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });
  }

  async updatePassword(id: string, hashedPassword: string, isTemporary = false) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        isTemporaryPassword: isTemporary,
      },
    });
  }

  async toggleUserStatus(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      include: {
        role: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}