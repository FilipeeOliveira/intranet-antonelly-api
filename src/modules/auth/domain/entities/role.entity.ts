export enum RoleType {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  PADRAO = 'PADRAO',
}

export class Role {
  constructor(
    public readonly id: string,
    public readonly name: RoleType,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}