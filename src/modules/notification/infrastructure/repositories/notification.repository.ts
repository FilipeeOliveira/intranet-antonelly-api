import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { NotificationQueryDto } from "../../domain/dto/notification-query.dto";

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countAll(filters?: NotificationQueryDto) {
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", read } = filters ?? {};

    const skip = (page - 1) * limit;

    return this.prisma.notification.count({
      skip,
      take: limit,

      where: {
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(read === "read" && { read: true }),
        ...(read === "unread" && { read: false }),
      },

      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async findAll(filters?: NotificationQueryDto) {
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", read } = filters ?? {};

    const skip = (page - 1) * limit;

    return this.prisma.notification.findMany({
      skip,
      take: limit,

      where: {
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(read === "read" && { read: true }),
        ...(read === "unread" && { read: false }),
      },

      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async markManyAsRead(ids: string[]) {
    return this.prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        read: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async create(data: { title: string; description: string; severity: string }) {
    return this.prisma.notification.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      severity?: string;
      read?: boolean;
    },
  ) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
