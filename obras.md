API de Obras — Especificação Técnica (NestJS + Prisma + PostgreSQL)

Atenção: Requisito, os dados precisam seguir o padrao ingles de escrita nas funcoes e criacoes da api, mas a documentacao pode ser em portugues, para facilitar o entendimento dos envolvidos.

1. 🗃️ Modelagem da Entidade (Prisma Schema)
// schema.prisma

enum ObraStatus {
  planejamento
  em_andamento
  pausada
  concluida
  cancelada
}

enum ObraCategoria {
  OBRAS
  IP4
  PORTOS
  DSM
}

model Obra {
  id               String        @id @default(uuid())
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")
  createdBy        String        @map("created_by") // user ID

  nome             String
  categoria        ObraCategoria @default(OBRAS)
  descricao        String?
  endereco         String?
  cliente          String?
  responsavel      String?
  dataInicio       DateTime      @map("data_inicio")
  dataFimPrevista  DateTime      @map("data_fim_prevista")
  dataFimReal      DateTime?     @map("data_fim_real")
  valorContrato    Decimal?      @map("valor_contrato") @db.Decimal(14, 2)
  status           ObraStatus    @default(planejamento)
  imagemUrl        String?       @map("imagem_url")

  // Relacionamentos
  planilhas        PlanilhaSintetica[]
  registros        RegistroAvanco[]
  engenheiros      ObraEngenheiro[]
  rdos             RDO[]
  medicoes         Medicao[]

  @@map("obras")
}
2. 📁 Estrutura de Pastas (Arquitetura Modular)
src/
├── modules/
│   └── obras/
│       ├── obras.module.ts
│       ├── obras.controller.ts
│       ├── obras.service.ts
│       ├── obras.repository.ts
│       ├── dto/
│       │   ├── create-obra.dto.ts
│       │   ├── update-obra.dto.ts
│       │   ├── filter-obra.dto.ts
│       │   └── obra-response.dto.ts
│       ├── use-cases/
│       │   ├── create-obra.use-case.ts
│       │   ├── update-obra.use-case.ts
│       │   ├── delete-obra.use-case.ts
│       │   └── get-obras.use-case.ts
│       └── __tests__/
│           ├── obras.service.spec.ts
│           └── obras.controller.spec.ts
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interceptors/
│       └── transform.interceptor.ts
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
3. 📦 DTOs (Request / Response)
create-obra.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, Min, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateObraDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome da obra é obrigatório' })
  nome: string;

  @IsEnum(['OBRAS', 'IP4', 'PORTOS', 'DSM'])
  @IsOptional()
  categoria?: string = 'OBRAS';

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  cliente?: string;

  @IsString()
  @IsOptional()
  responsavel?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  dataInicio: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data fim prevista é obrigatória' })
  dataFimPrevista: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  valorContrato?: number;

  @IsEnum(['planejamento', 'em_andamento', 'pausada', 'concluida', 'cancelada'])
  @IsOptional()
  status?: string = 'planejamento';

  @IsUrl()
  @IsOptional()
  imagemUrl?: string;
}
update-obra.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateObraDto } from './create-obra.dto';

export class UpdateObraDto extends PartialType(CreateObraDto) {}
filter-obra.dto.ts
import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterObraDto {
  @IsOptional()
  @IsString()
  search?: string; // busca por nome ou cliente

  @IsOptional()
  @IsEnum(['OBRAS', 'IP4', 'PORTOS', 'DSM'])
  categoria?: string;

  @IsOptional()
  @IsEnum(['planejamento', 'em_andamento', 'pausada', 'concluida', 'cancelada'])
  status?: string;

  @IsOptional()
  @IsEnum(['data', 'alfabetica', 'status'])
  ordenacao?: string = 'data';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
obra-response.dto.ts
export class ObraResponseDto {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  endereco?: string;
  cliente?: string;
  responsavel?: string;
  dataInicio: string;
  dataFimPrevista: string;
  dataFimReal?: string;
  valorContrato?: number;
  status: string;
  imagemUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Campos calculados (opcionais, retornados sob demanda)
  progressoFinanceiro?: number;   // % do valor executado vs contrato
  progressoFisico?: number;       // % físico com base nos registros
  diasRestantes?: number;
}
4. 🔁 Endpoints (Controller)
// obras.controller.ts

@Controller('obras')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ObrasController {

  // GET /obras — Lista todas (com filtros)
  @Get()
  findAll(@Query() filters: FilterObraDto, @CurrentUser() user: UserPayload) {}

  // GET /obras/:id — Detalhe de uma obra
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: UserPayload) {}

  // POST /obras — Criar nova obra
  @Post()
  @Roles('admin', 'engenheiro')
  create(@Body() dto: CreateObraDto, @CurrentUser() user: UserPayload) {}

  // PATCH /obras/:id — Atualizar obra
  @Patch(':id')
  @Roles('admin', 'engenheiro')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateObraDto, @CurrentUser() user: UserPayload) {}

  // DELETE /obras/:id — Excluir obra
  @Delete(':id')
  @Roles('admin')  // somente admin pode excluir
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: UserPayload) {}

  // PATCH /obras/:id/status — Alterar status (ação específica)
  @Patch(':id/status')
  @Roles('admin', 'engenheiro')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: ObraStatus },
    @CurrentUser() user: UserPayload
  ) {}

  // GET /obras/:id/progresso — Retorna progresso calculado
  @Get(':id/progresso')
  getProgresso(@Param('id', ParseUUIDPipe) id: string) {}
}
Resumo dos Endpoints:

Método	Rota	Descrição	Role
GET	/obras	Listar obras (com filtros)	Todos autenticados
GET	/obras/:id	Detalhar obra	Todos autenticados
POST	/obras	Criar nova obra	admin, engenheiro
PATCH	/obras/:id	Editar obra	admin, engenheiro
DELETE	/obras/:id	Excluir obra	admin
PATCH	/obras/:id/status	Alterar status	admin, engenheiro
GET	/obras/:id/progresso	Progresso calculado	Todos autenticados
5. 🔐 Regras de Autorização
// Lógica no service, após buscar a obra do banco

function verificarAcessoObra(user: UserPayload, obra: Obra) {
  if (user.role === 'admin') return; // admin vê tudo

  // Engenheiro só acessa obras vinculadas a ele via ObraEngenheiro
  const temAcesso = obra.engenheiros.some(e => e.userEmail === user.email);
  if (!temAcesso) throw new ForbiddenException('Sem acesso a esta obra');
}
Matriz de permissões:

Ação	admin	engenheiro (vinculado)	engenheiro (não vinculado)
Listar obras	✅ todas	✅ só as suas	❌
Ver detalhe	✅	✅	❌
Criar	✅	✅	✅
Editar	✅	✅	❌
Deletar	✅	❌	❌
Alterar status	✅	✅	❌
6. 🔄 Fluxo de Status
planejamento ──► em_andamento ──► concluida
      │               │
      └──► cancelada  └──► pausada ──► em_andamento
Transições válidas:

De	Para	Quem pode
planejamento	em_andamento, cancelada	admin, engenheiro
em_andamento	pausada, concluida, cancelada	admin, engenheiro
pausada	em_andamento, cancelada	admin, engenheiro
concluida	— (bloqueado)	—
cancelada	— (bloqueado)	—
// use-cases/update-obra.use-case.ts

const transicoesValidas: Record<ObraStatus, ObraStatus[]> = {
  planejamento: ['em_andamento', 'cancelada'],
  em_andamento: ['pausada', 'concluida', 'cancelada'],
  pausada:      ['em_andamento', 'cancelada'],
  concluida:    [],
  cancelada:    [],
};

function validarTransicaoStatus(atual: ObraStatus, novo: ObraStatus) {
  const permitidos = transicoesValidas[atual];
  if (!permitidos.includes(novo)) {
    throw new BadRequestException(
      `Transição inválida: ${atual} → ${novo}`
    );
  }
}
7. ✅ Regras de Validação
// No use-case de criação e atualização

function validarDatas(dataInicio: Date, dataFimPrevista: Date) {
  if (dataFimPrevista <= dataInicio) {
    throw new BadRequestException('Data fim deve ser posterior à data de início');
  }
}

function validarValorContrato(valor?: number) {
  if (valor !== undefined && valor < 0) {
    throw new BadRequestException('Valor do contrato não pode ser negativo');
  }
}

// Ao deletar: verificar dependências
async function validarDelecao(obraId: string) {
  const [rdos, medicoes, planilhas] = await Promise.all([
    prisma.rDO.count({ where: { obraId } }),
    prisma.medicao.count({ where: { obraId } }),
    prisma.planilhaSintetica.count({ where: { obraId } }),
  ]);

  if (rdos > 0 || medicoes > 0 || planilhas > 0) {
    throw new ConflictException(
      'Obra possui dados vinculados (RDOs, medições, planilha). Remova-os antes de excluir.'
    );
  }
}
8. 🔧 Service (Lógica de Negócio)
// obras.service.ts

@Injectable()
export class ObrasService {

  async findAll(filters: FilterObraDto, user: UserPayload) {
    const where: Prisma.ObraWhereInput = {};

    // Filtro de acesso por role
    if (user.role !== 'admin') {
      where.engenheiros = { some: { userEmail: user.email } };
    }

    // Filtros opcionais
    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { cliente: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) where.status = filters.status as ObraStatus;
    if (filters.categoria) where.categoria = filters.categoria as ObraCategoria;

    // Ordenação
    const orderBy = {
      data: { createdAt: 'desc' as const },
      alfabetica: { nome: 'asc' as const },
      status: { status: 'asc' as const },
    }[filters.ordenacao || 'data'];

    const [obras, total] = await Promise.all([
      this.obrasRepository.findMany({ where, orderBy, skip: (filters.page - 1) * filters.limit, take: filters.limit }),
      this.obrasRepository.count({ where }),
    ]);

    return { data: obras, total, page: filters.page, limit: filters.limit };
  }

  async create(dto: CreateObraDto, user: UserPayload) {
    validarDatas(new Date(dto.dataInicio), new Date(dto.dataFimPrevista));
    validarValorContrato(dto.valorContrato);

    return this.obrasRepository.create({
      ...dto,
      createdBy: user.id,
    });
  }

  async update(id: string, dto: UpdateObraDto, user: UserPayload) {
    const obra = await this.findOneOrFail(id);
    verificarAcessoObra(user, obra);

    if (dto.dataInicio || dto.dataFimPrevista) {
      validarDatas(
        new Date(dto.dataInicio || obra.dataInicio),
        new Date(dto.dataFimPrevista || obra.dataFimPrevista)
      );
    }

    return this.obrasRepository.update(id, dto);
  }

  async remove(id: string, user: UserPayload) {
    await this.findOneOrFail(id);
    await validarDelecao(id); // verifica dependências
    return this.obrasRepository.delete(id);
  }

  async updateStatus(id: string, novoStatus: ObraStatus, user: UserPayload) {
    const obra = await this.findOneOrFail(id);
    verificarAcessoObra(user, obra);
    validarTransicaoStatus(obra.status, novoStatus);

    // Se concluindo, salva a data real
    const extra = novoStatus === 'concluida' ? { dataFimReal: new Date() } : {};
    return this.obrasRepository.update(id, { status: novoStatus, ...extra });
  }
}
9. 🗄️ Repository Pattern
// obras.repository.ts

@Injectable()
export class ObrasRepository {
  constructor(private prisma: PrismaService) {}

  findMany(args: Prisma.ObraFindManyArgs) {
    return this.prisma.obra.findMany({
      ...args,
      include: { engenheiros: true },
    });
  }

  findOne(id: string) {
    return this.prisma.obra.findUnique({
      where: { id },
      include: { engenheiros: true },
    });
  }

  count(args: Prisma.ObraCountArgs) {
    return this.prisma.obra.count(args);
  }

  create(data: Prisma.ObraCreateInput) {
    return this.prisma.obra.create({ data });
  }

  update(id: string, data: Prisma.ObraUpdateInput) {
    return this.prisma.obra.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.obra.delete({ where: { id } });
  }
}
10. ❌ Tratamento de Erros
// common/filters/http-exception.filter.ts

// Mapeamento de erros Prisma → HTTP
const prismaErrorMap = {
  P2002: () => new ConflictException('Registro duplicado'),
  P2025: () => new NotFoundException('Registro não encontrado'),
  P2003: () => new ConflictException('Violação de chave estrangeira — existem dados vinculados'),
};

// Erros de negócio lançados no service:
// NotFoundException    → 404 (obra não existe)
// ForbiddenException  → 403 (sem permissão)
// BadRequestException → 400 (validação / transição de status inválida)
// ConflictException   → 409 (tentativa de deletar obra com dados vinculados)
Formato padrão de response de erro:

{
  "statusCode": 400,
  "message": "Data fim deve ser posterior à data de início",
  "error": "Bad Request",
  "timestamp": "2026-03-04T12:00:00.000Z",
  "path": "/obras"
}
11. 📊 Endpoint de Progresso (Calculado no Backend)
// GET /obras/:id/progresso

async getProgresso(id: string) {
  const [planilhas, registros] = await Promise.all([
    prisma.planilhaSintetica.findMany({ where: { obraId: id } }),
    prisma.registroAvanco.findMany({ where: { obraId: id } }),
  ]);

  const totalPrevisto = planilhas.reduce((s, p) =>
    s + Number(p.valorTotal || (p.quantidadePrevista * p.valorUnitario) || 0), 0);

  const totalExecutado = registros.reduce((s, r) =>
    s + Number(r.valorExecutado || 0), 0);

  const progressoFinanceiro = totalPrevisto > 0
    ? (totalExecutado / totalPrevisto) * 100
    : 0;

  return {
    totalPrevisto,
    totalExecutado,
    progressoFinanceiro: parseFloat(progressoFinanceiro.toFixed(2)),
    diasRestantes: /* diferença entre hoje e dataFimPrevista */,
  };
}
✅ Checklist de Implementação (Página de Obras)
 Criar módulo ObrasModule
 Implementar ObrasRepository com Prisma
 Implementar ObrasService com regras de negócio
 Implementar ObrasController com os 7 endpoints
 Criar e validar todos os DTOs com class-validator
 Configurar JwtAuthGuard global
 Configurar RolesGuard com decorator @Roles()
 Implementar filtro global de exceções Prisma
 Implementar interceptor de transformação de response
 Escrever testes unitários do service
