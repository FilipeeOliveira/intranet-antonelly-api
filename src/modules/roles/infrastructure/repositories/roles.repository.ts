import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { RoleQueryDto } from "../../domain/dto/role-query.dto";

@Injectable()
export class RolesRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findAll(filters?: RoleQueryDto) {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = filters ?? {};

        const skip = (page - 1) * limit;

        return this.prisma.role.findMany({
            skip,
            take: limit,
            where: {
                ...(search && {
                    OR: [
                        {
                            key: {
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
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.role.findUnique({
            where: { id },
        });
    }

    async findByKey(key: string) {
        return this.prisma.role.findUnique({
            where: { key },
        });
    }

    async create(data: {
        key: string;
        description: string;
    }) {
        return this.prisma.role.create({
            data,
        });
    }

    async update(
        id: string,
        data: {
            key?: string;
            description?: string;
        },
    ) {
        return this.prisma.role.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.role.delete({
            where: { id },
        });
    }
}
