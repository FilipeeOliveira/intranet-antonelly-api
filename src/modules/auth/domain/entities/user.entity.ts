import { Role } from "./role.entity";

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly username: string | null,
    public readonly password: string,
    public readonly setor: string | null,
    public readonly roleId: string,
    public readonly isActive: boolean,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}