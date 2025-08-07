export enum RoleType {
  ADMIN = 'ADMIN',
  DIRETOR = 'DIRETOR',
  GERENTE = 'GERENTE',
  PORTARIA = 'PORTARIA',
  FUNCIONARIO = 'FUNCIONARIO',
}

export class Role {
  constructor(
    public readonly id: string,
    public readonly key: RoleType,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}