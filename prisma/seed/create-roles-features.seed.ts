import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* 
 No final do arquivo terá uma comentário de documentação sobre como essa seed funciona.
*/

const DIRETOR_DOMAINS = {
  READ: [
    "USERS",
    "COMPANIES",
    "COMMUNIQUES",
    "MEETING",
    "SECTORS",
    "ROOMS",
    "DOCUMENTS",
    "PERMISSIONS",
    "ORDERS",
  ],
  WRITE: [
    "COMMUNIQUES",
    "MEETING",
    "DOCUMENTS",
  ],
};

const GERENTE_DOMAINS = {
  READ: [
    "COMMUNIQUES",
    "DOCUMENTS",
    "MEETING",
    "PERMISSIONS"
  ],
  WRITE: [
    "COMMUNIQUES",
    "DOCUMENTS",
    "MEETING",
  ],
};


const PORTARIA_DOMAINS = {
  READ: [
    "VISIT_SCHEDULES",
    "VISIT_PRESENTS",
    "VISIT_HISTORY",
    "PERMISSIONS",
    "ORDERS",
  ],
  WRITE: [
    "VISIT_SCHEDULES",
    "VISIT_PRESENTS",
    "VISIT_HISTORY",
    "ORDERS",
  ],
}

const FUNCIONARIO_DOMAINS = {
  READ: [
    "COMMUNIQUES",
    "DOCUMENTS",
    "PERMISSIONS",
  ],
  WRITE: [],
};

// Helpers fora da cargo
const byDomain = (domains: string[]) => (f: { key: string }) =>
  domains.some((d) => f.key.startsWith(`${d}_`));

function isReadFeature(key: string) {
  return (
    key.endsWith("_READ")
  );
}


export async function createRoleFeaturesSeed() {
  console.log("🔗 Criando associações Role → Features...");

  const roles = await prisma.role.findMany();
  const features = await prisma.feature.findMany();

  const roleMap = {
    SUPERADMIN: roles.find((r) => r.key === "SUPERADMIN"),
    ADMIN: roles.find((r) => r.key === "ADMIN"),
    DIRETOR: roles.find((r) => r.key === "DIRETOR"),
    GERENTE: roles.find((r) => r.key === "GERENTE"),
    PORTARIA: roles.find((r) => r.key === "PORTARIA"),
    FUNCIONARIO: roles.find((r) => r.key === "FUNCIONARIO"),
  };

  if (!Object.values(roleMap).every(Boolean)) {
    throw new Error("Alguma role não foi encontrada. Rode o seed de roles antes.");
  }

  // BASE COMUM: leitura para tudo
  const baseReadFeatures = features
    .filter((f) => isReadFeature(f.key))

  const roleFeaturesMap: Record<string, string[]> = {
    SUPERADMIN: features.map((f) => f.id),
    ADMIN: features.map((f) => f.id),

    DIRETOR: [
      // Features de leitura de certos domínios
      ...baseReadFeatures
        .filter(byDomain(DIRETOR_DOMAINS.READ))
        .map((f) => f.id),

      // Features só de escrita e elimina as de leitura
      ...features
        .filter(
          (f) =>
            byDomain(DIRETOR_DOMAINS.WRITE)(f) &&
            !isReadFeature(f.key),
        )
        .map((f) => f.id),
    ],

    GERENTE: [
      ...baseReadFeatures.filter(byDomain(GERENTE_DOMAINS.READ))
        .map((f) => f.id),
      ...features.filter((f) => byDomain(GERENTE_DOMAINS.WRITE)(f) && !isReadFeature(f.key))
        .map((f) => f.id),
    ],

    PORTARIA: [
      ...baseReadFeatures.filter(byDomain(PORTARIA_DOMAINS.READ))
        .map((f) => f.id),
      ...features
        .filter((f) => byDomain(PORTARIA_DOMAINS.WRITE)(f) && !isReadFeature(f.key))
        .map((f) => f.id),
    ],

    FUNCIONARIO: [
      ...baseReadFeatures.filter(byDomain(FUNCIONARIO_DOMAINS.READ))
        .map((f) => f.id),
      ...features
        .filter((f) => byDomain(FUNCIONARIO_DOMAINS.WRITE)(f) && !isReadFeature(f.key))
        .map((f) => f.id),
    ],
  };

  // Limpa associações antigas
  await prisma.roleFeature.deleteMany();

  // Cria novas associações
  for (const [roleKey, featureIds] of Object.entries(roleFeaturesMap)) {
    const role = roleMap[roleKey as keyof typeof roleMap];
    if (!role) continue;

    // remove duplicados por segurança
    const uniqueFeatureIds = Array.from(new Set(featureIds));

    await prisma.roleFeature.createMany({
      data: uniqueFeatureIds.map((featureId) => ({
        roleId: role.id,
        featureId,
      })),
      skipDuplicates: true,
    });

    console.log(`✅ Role ${role.key} → ${uniqueFeatureIds.length} features`);
  }

  console.log("🎉 Seed de RoleFeatures concluído com sucesso");
}


/** DOCUMENTAÇÃO DO SEED DE ROLES → FEATURES  
 * ============================================================
 * ROLE → FEATURE SEED (RBAC híbrido e explícito)
 * ============================================================
 *
 * O que este script faz:
 * ----------------------
 * Este seed cria a associação ENTRE Roles e Features de forma
 * ESTÁTICA, usando a tabela `role_features`.
 *
 * Ele NÃO amarra o usuário à role diretamente.
 * A role funciona como um "template" de permissões.
 *
 * A fonte da verdade final continua sendo:
 *   - user_features
 *
 * As roles servem para:
 *   - aplicar permissões iniciais ao criar um usuário
 *   - redefinir permissões quando o cargo do usuário muda
 *
 *
 * ============================================================
 * COMO ENTENDER A LÓGICA
 * ============================================================
 *
 * 1️⃣ LEITURA E ESCRITA SÃO COISAS DIFERENTES
 *
 * - Qualquer permissão que termine com:
 *     _READ
 *     _READ_ALL
 *     _READ_BY_ID
 *   é considerada uma permissão de LEITURA.
 *
 * - Qualquer outra action (CREATE, UPDATE, DELETE, CONFIRM, etc.)
 *   é considerada ESCRITA ou AÇÃO.
 *
 * 👉 O script garante que:
 *   - Leitura só é concedida quando explicitamente definida
 *   - Escrita NUNCA concede leitura automaticamente
 *
 *
 * ============================================================
 * 2️⃣ CONFIGURAÇÃO DAS ROLES
 * ============================================================
 *
 * Cada role possui dois grupos de domínios:
 *
 *   READ  → domínios que a role pode APENAS VISUALIZAR
 *   WRITE → domínios que a role pode MODIFICAR
 *
 * Exemplo:
 *
 *   DIRETOR_DOMAINS = {
 *     READ:  ["USERS", "COMPANIES"],
 *     WRITE: ["COMMUNIQUES"]
 *   }
 *
 * Significa:
 *   - Diretor pode ler usuários e empresas
 *   - Diretor pode criar/editar comunicados
 *   - Diretor NÃO pode editar usuários
 *
 *
 * ============================================================
 * 3️⃣ COMO ADICIONAR / REMOVER PERMISSÕES
 * ============================================================
 *
 * ➕ Para adicionar acesso:
 *   - Inclua o domínio no READ ou WRITE da role
 *
 * ➖ Para remover acesso:
 *   - Remova o domínio da lista correspondente
 *
 * ❗ IMPORTANTE:
 *   - WRITE SEMPRE deve ser acompanhado de READ se o usuário
 *     precisar enxergar a página
 *   - O script NÃO adiciona leitura automaticamente
 *
 *
 * ============================================================
 * 4️⃣ COMO ADICIONAR / REMOVER UMA ROLE
 * ============================================================
 *
 * ➕ Para adicionar uma nova role:
 *   - Crie o objeto <ROLE>_DOMAINS
 *   - Adicione a role no roleMap
 *   - Adicione a role no roleFeaturesMap
 *
 * ➖ Para remover uma role:
 *   - Remova do roleMap
 *   - Remova do roleFeaturesMap
 *
 *
 * ============================================================
 * 5️⃣ COMPORTAMENTO ESPECIAL
 * ============================================================
 *
 * - ADMIN recebe TODAS as features (leitura + escrita)
 * - EXPORT é tratado separadamente
 * - Duplicações são removidas com Set antes do insert
 *
 */
