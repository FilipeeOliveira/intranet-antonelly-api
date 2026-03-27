import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

export interface Feature {
  id: string;
  prettyName: string;
  key: string;
  description: string;
  pageId: string;
}

// Interface para Page (agrupamento de features)
export interface Page {
  id: string;
  name: string;
  features: Feature[];
}

// Response completo da listagem de páginas com features
export interface PagesWithFeaturesResponse {
  data: Page[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Features protegidas para admins (não podem remover de si mesmos)
const ADMIN_PROTECTED_FEATURE_KEYS = ["USERS_READ", "USERS_WRITE", "PERMISSIONS_READ", "PERMISSIONS_WRITE"];

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  private async isUserSuperAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    return user?.role?.key === "SUPERADMIN";
  }

  private async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    return user?.role?.key === "ADMIN";
  }

  private async getProtectedFeatureIds(): Promise<string[]> {
    const features = await this.prisma.feature.findMany({
      where: { key: { in: ADMIN_PROTECTED_FEATURE_KEYS } },
    });
    return features.map((f) => f.id);
  }

  async getAllPagesWithFeatures(includeHidden = false) {
    const pages = await this.prisma.page.findMany({
      include: {
        features: {
          where: includeHidden ? undefined : { hidden: false },
        },
      },
    });

    if (includeHidden) return pages;

    // Omite páginas cujas todas as features estão ocultas
    return pages.filter((page) => page.features.length > 0);
  }

  async setUserPermissions(userId: string, featureIds: string[], requesterId?: string) {
    if (await this.isUserSuperAdmin(userId)) {
      throw new ForbiddenException("Não é possível alterar permissões do Super Administrador.");
    }

    // Se admin está editando suas próprias permissões, garantir que as protegidas estão incluídas
    if (requesterId && requesterId === userId && (await this.isUserAdmin(userId))) {
      const protectedIds = await this.getProtectedFeatureIds();
      for (const protectedId of protectedIds) {
        if (!featureIds.includes(protectedId)) {
          featureIds.push(protectedId);
        }
      }
    }

    // Verifica se o usuário existe
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Remove apenas permissões de features visíveis (hidden = false).
    // Permissões de features ocultas são gerenciadas internamente e não devem
    // ser afetadas pelo modal de edição de permissões.
    await this.prisma.userPermission.deleteMany({
      where: {
        userId,
        feature: { hidden: false },
      },
    });

    // Insere as novas
    const data = featureIds.map((featureId) => ({ userId, featureId }));

    await this.prisma.userPermission.createMany({
      data,
      skipDuplicates: true,
    });

    // Retorna as permissões atualizadas
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: { include: { feature: { include: { page: true } } } },
      },
    });
  }

  async getUserFeatures(userId: string): Promise<Feature[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: { include: { feature: true } } },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.permissions.map((p) => p.feature);
  }

  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: { feature: { include: { page: true } } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Converter em formato JSON estruturado
    const pages: Record<string, any> = {};

    user.permissions.forEach((p) => {
      const pageName = p.feature.page.name;
      if (!pages[pageName]) {
        pages[pageName] = {
          allowed: true,
          features: {},
        };
      }
      pages[pageName].features[p.feature.key] = true;
    });

    return { pages };
  }

  async assignFeature(userId: string, featureId: string) {
    if (await this.isUserSuperAdmin(userId)) {
      throw new ForbiddenException("Não é possível alterar permissões do Super Administrador.");
    }
    return this.prisma.userPermission.create({
      data: { userId, featureId },
    });
  }

  async assignManyFeatures(userId: string, featureIds: string[]) {
    if (await this.isUserSuperAdmin(userId)) {
      throw new ForbiddenException("Não é possível alterar permissões do Super Administrador.");
    }
    const data = featureIds.map((featureId) => ({ userId, featureId }));
    return this.prisma.userPermission.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async revokeFeature(userId: string, featureId: string, requesterId?: string) {
    if (await this.isUserSuperAdmin(userId)) {
      throw new ForbiddenException("Não é possível alterar permissões do Super Administrador.");
    }

    // Se admin está removendo uma permissão protegida de si mesmo
    if (requesterId && requesterId === userId && (await this.isUserAdmin(userId))) {
      const protectedIds = await this.getProtectedFeatureIds();
      if (protectedIds.includes(featureId)) {
        throw new ForbiddenException(
          "Administradores não podem remover suas próprias permissões de Usuários e Permissões.",
        );
      }
    }

    return this.prisma.userPermission.deleteMany({
      where: { userId, featureId },
    });
  }

  async revokeManyFeatures(userId: string, featureIds: string[], requesterId?: string) {
    if (await this.isUserSuperAdmin(userId)) {
      throw new ForbiddenException("Não é possível alterar permissões do Super Administrador.");
    }

    // Se admin está removendo permissões protegidas de si mesmo
    if (requesterId && requesterId === userId && (await this.isUserAdmin(userId))) {
      const protectedIds = await this.getProtectedFeatureIds();
      const protectedBeingRemoved = featureIds.filter((id) => protectedIds.includes(id));
      if (protectedBeingRemoved.length > 0) {
        throw new ForbiddenException(
          "Administradores não podem remover suas próprias permissões de Usuários e Permissões.",
        );
      }
    }

    return this.prisma.userPermission.deleteMany({
      where: {
        userId,
        featureId: { in: featureIds },
      },
    });
  }
}
