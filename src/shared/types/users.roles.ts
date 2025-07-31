export const USER_ROLES = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  PADRAO: 'PADRAO',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];