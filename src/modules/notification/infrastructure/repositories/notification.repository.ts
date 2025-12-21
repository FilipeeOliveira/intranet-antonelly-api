import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    description: string;
    severity: string;
  }) {
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
