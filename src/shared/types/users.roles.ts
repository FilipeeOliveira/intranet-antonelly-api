export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DIRETOR: 'DIRETOR',
  GERENTE: 'GERENTE',
  PORTARIA: 'PORTARIA',
  FUNCIONARIO: 'FUNCIONARIO',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];