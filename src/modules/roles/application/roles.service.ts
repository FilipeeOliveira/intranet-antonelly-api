import {
    Injectable,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { RolesRepository } from "../infrastructure/repositories/roles.repository";
import { RoleQueryDto } from "../domain/dto/role-query.dto";
import { CreateRoleDto } from "../domain/dto/create-role.dto";
import { UpdateRoleDto } from "../domain/dto/update-role.dto";

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) { }

    async findAll(filters?: RoleQueryDto) {
        return this.rolesRepository.findAll(filters);
    }

    async findById(id: string) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException("Role não encontrada");
        }

        return role;
    }

    async create(dto: CreateRoleDto) {
        const existingRole = await this.rolesRepository.findByKey(dto.key);

        if (existingRole) {
            throw new ConflictException("Já existe uma role com essa key");
        }

        return this.rolesRepository.create(dto);
    }

    async update(id: string, dto: UpdateRoleDto) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException("Role não encontrada");
        }

        if (dto.key && dto.key !== role.key) {
            const roleWithSameKey = await this.rolesRepository.findByKey(dto.key);

            if (roleWithSameKey) {
                throw new ConflictException("Já existe uma role com essa key");
            }
        }

        return this.rolesRepository.update(id, dto);
    }

    async delete(id: string) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException("Role não encontrada");
        }

        return this.rolesRepository.delete(id);
    }
}
