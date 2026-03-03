Análise e Estrutura da API de Encomendas
1. Modelagem da Entidade Encomenda (Schema no Prisma)
A entidade Encomenda existente já é um bom ponto de partida. Vamos refinar e detalhar os tipos e regras de negócio para o contexto do NestJS/Prisma.

// schema.prisma (dentro do modelo Encomenda)

model Encomenda {
  id                    String    @id @default(uuid()) // ID gerado automaticamente
  numeroProtocolo       String    @unique // Número de protocolo gerado automaticamente pelo backend
  tipo                  TipoEncomenda @default(ENCOMENDA)
  remetente             String?   @db.VarChar(255)
  transportadora        String?   @db.VarChar(255)
  codigoRastreio        String?   @db.VarChar(255)
  descricao             String?   @db.Text
  destinatarioNome      String    @db.VarChar(255) // Nome do destinatário interno
  destinatarioSetor     String?   @db.VarChar(255)
  destinatarioEmail     String    @db.VarChar(255)
  dataRecebimento       DateTime  // Data e hora do recebimento na portaria
  recebidoPor           String    @db.VarChar(255) // Nome de quem recebeu na portaria (usuário logado)
  status                StatusEncomenda @default(AGUARDANDO_RETIRADA)
  dataEntrega           DateTime? // Data e hora da entrega ao destinatário
  entreguePara          String?   @db.VarChar(255) // Nome de quem retirou a encomenda
  entreguePor           String?   @db.VarChar(255) // Nome de quem realizou a entrega (usuário logado)
  observacoes           String?   @db.Text
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

enum TipoEncomenda {
  ENCOMENDA
  CARTA
  DOCUMENTO
  PACOTE
  OUTRO
}

enum StatusEncomenda {
  AGUARDANDO_RETIRADA // Default: Encomenda recebida na portaria, aguardando o destinatário
  ENTREGUE            // Encomenda retirada pelo destinatário
  DEVOLVIDO           // Encomenda devolvida ao remetente
}
Justificativas para Mudanças/Adições:

id: Adicionado id como UUID (padrão Base44) e @unique para numeroProtocolo.
numeroProtocolo: Gerado no backend (formato ENC-YYYY-NNNN).
remetente, transportadora, codigoRastreio, descricao, destinatarioSetor: Tornados opcionais (com ?).
dataRecebimento, recebidoPor, destinatarioEmail: recebidoPor deve ser o usuário logado no recebimento. destinatarioEmail é crucial para notificações.
dataEntrega, entreguePara, entreguePor: Tornados opcionais, preenchidos apenas no status ENTREGUE. entreguePor deve ser o usuário logado que registrou a entrega.
createdAt, updatedAt: Adicionados para rastreamento.
Enums: Usados para tipo e status para garantir consistência.
@db.VarChar(X) e @db.Text: Para otimizar o uso do banco de dados com PostgreSQL.
2. Estrutura de Endpoints
A arquitetura será modular, com um módulo EncomendasModule.

Base URL: /api/encomendas

POST /: Registrar Recebimento de uma nova encomenda.

Descrição: Cria um novo registro de encomenda com status AGUARDANDO_RETIRADA. O numeroProtocolo é gerado automaticamente.
Corpo da Requisição: CreateEncomendaDto
Resposta: EncomendaResponseDto (201 Created)
GET /: Listar Encomendas.

Descrição: Retorna uma lista paginada e filtrável de todas as encomendas.
Parâmetros de Query: ListEncomendasDto (ex: ?status=AGUARDANDO_RETIRADA&destinatarioEmail=...&page=1&limit=10)
Resposta: PaginatedEncomendasResponseDto (200 OK)
GET /:id: Obter Encomenda por ID.

Descrição: Retorna os detalhes de uma encomenda específica.
Parâmetros de Rota: id (UUID da encomenda)
Resposta: EncomendaResponseDto (200 OK)
PATCH /:id/registrar-entrega: Registrar Entrega da encomenda.

Descrição: Atualiza o status da encomenda para ENTREGUE, registrando dataEntrega, entreguePara e entreguePor.
Corpo da Requisição: RegistrarEntregaDto
Resposta: EncomendaResponseDto (200 OK)
PATCH /:id/registrar-devolucao: Registrar Devolução da encomenda.

Descrição: Atualiza o status da encomenda para DEVOLVIDO.
Corpo da Requisição: (Pode ser vazio ou incluir observações) RegistrarDevolucaoDto
Resposta: EncomendaResponseDto (200 OK)
PUT /:id: Atualizar Encomenda (Admin).

Descrição: Permite que administradores editem qualquer campo da encomenda.
Corpo da Requisição: UpdateEncomendaDto
Resposta: EncomendaResponseDto (200 OK)
DELETE /:id: Remover Encomenda (Admin).

Descrição: Remove uma encomenda do sistema.
Resposta: (204 No Content)
3. Regras de Validação
Usaremos class-validator e class-transformer no NestJS.

Para CreateEncomendaDto (Registrar Recebimento):

tipo: Obrigatório, deve ser um dos valores do enum TipoEncomenda.
remetente: Opcional, string.
transportadora: Opcional, string.
codigoRastreio: Opcional, string.
descricao: Opcional, string.
destinatarioNome: Obrigatório, string.
destinatarioSetor: Opcional, string.
destinatarioEmail: Obrigatório, string, formato de email válido.
observacoes: Opcional, string.
recebidoPor: Opcional, string (será preenchido pelo backend com o usuário logado).
Para RegistrarEntregaDto:

entreguePara: Obrigatório, string (nome de quem retirou).
entreguePor: Opcional, string (será preenchido pelo backend com o usuário logado).
Para RegistrarDevolucaoDto:

observacoes: Opcional, string (para justificar a devolução).
Para UpdateEncomendaDto (Admin):

Todos os campos podem ser opcionais, mas devem seguir as validações de tipo e formato se presentes.
Para ListEncomendasDto:

status: Opcional, deve ser um dos valores do enum StatusEncomenda.
destinatarioEmail: Opcional, string, formato de email válido.
page: Opcional, número inteiro > 0 (default 1).
limit: Opcional, número inteiro entre 1 e 100 (default 10).
sortBy: Opcional, string (ex: 'dataRecebimento').
sortOrder: Opcional, 'asc' ou 'desc'.
4. Fluxos de Status
AGUARDANDO_RETIRADA (Padrão ao criar):
Transições Permitidas:
Para ENTREGUE (via PATCH /:id/registrar-entrega)
Para DEVOLVIDO (via PATCH /:id/registrar-devolucao)
ENTREGUE:
Transições Permitidas: Nenhuma, este é um status final.
DEVOLVIDO:
Transições Permitidas: Nenhuma, este é um status final.
Regras de Negócio de Transição:

Só é possível registrar entrega ou devolução se o status for AGUARDANDO_RETIRADA.
Ao registrar ENTREGUE, dataEntrega, entreguePara e entreguePor devem ser preenchidos.
5. Estrutura de Pastas (NestJS Modular)
Uma abordagem modular com "feature modules" é ideal para NestJS.

src/
├── app.module.ts
├── main.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   ├── decorators/
│   │   └── auth-user.decorator.ts
│   └── pagination/
│       └── pagination.dto.ts
│       └── pagination.interceptor.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│       └── roles.guard.ts
├── database/
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── encomendas/
    ├── encomendas.module.ts
    ├── encomendas.controller.ts
    ├── encomendas.service.ts
    ├── encomendas.repository.ts // Usando como camada de abstração do Prisma
    ├── dto/
    │   ├── create-encomenda.dto.ts
    │   ├── update-encomenda.dto.ts
    │   ├── registrar-entrega.dto.ts
    │   ├── registrar-devolucao.dto.ts
    │   ├── list-encomendas.dto.ts
    │   └── encomenda-response.dto.ts
    ├── interfaces/
    │   └── encomenda.interface.ts // Se necessário para tipagem mais flexível
    └── guards/
        └── encomendas.guard.ts // Ex: para verificar permissões baseadas em roles
Justificativas:

Módulo Encomendas: Encapsula toda a lógica da feature.
encomendas.controller.ts: Lida com as requisições HTTP e as validações de input.
encomendas.service.ts: Contém a lógica de negócio principal e coordena as operações.
encomendas.repository.ts: Abstrai as interações com o banco de dados (via Prisma), facilitando testes e futuras mudanças de ORM/BD.
dto/: Pasta para Data Transfer Objects (DTOs) de requisição e resposta.
common/: Para filtros globais, interceptors, guards e decorators genéricos.
6. DTOs (Data Transfer Objects)
// encomendas/dto/create-encomenda.dto.ts
import { IsEnum, IsString, IsNotEmpty, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { TipoEncomenda } from '@prisma/client'; // Importar do Prisma

export class CreateEncomendaDto {
  @IsEnum(TipoEncomenda)
  @IsNotEmpty()
  tipo: TipoEncomenda;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remetente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  transportadora?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  codigoRastreio?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  destinatarioNome: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  destinatarioSetor?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  destinatarioEmail: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

// encomendas/dto/update-encomenda.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // ou from '@nestjs/swagger' se usar swagger
import { CreateEncomendaDto } from './create-encomenda.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEncomenda } from '@prisma/client';

export class UpdateEncomendaDto extends PartialType(CreateEncomendaDto) {
  @IsOptional()
  @IsEnum(StatusEncomenda)
  status?: StatusEncomenda; // Admin pode alterar o status diretamente (com cuidado)
  
  // Outros campos específicos para update, como dataEntrega, entreguePara, entreguePor
  // porém, para entregas/devoluções, preferimos DTOs específicos
}

// encomendas/dto/registrar-entrega.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class RegistrarEntregaDto {
  @IsString()
  @IsNotEmpty()
  entreguePara: string; // Nome de quem retirou a encomenda
}

// encomendas/dto/registrar-devolucao.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class RegistrarDevolucaoDto {
  @IsOptional()
  @IsString()
  observacoes?: string;
}

// encomendas/dto/list-encomendas.dto.ts
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEncomenda } from '@prisma/client';

export class ListEncomendasDto {
  @IsOptional()
  @IsEnum(StatusEncomenda)
  status?: StatusEncomenda;

  @IsOptional()
  @IsString()
  destinatarioEmail?: string;

  @IsOptional()
  @IsString()
  search?: string; // Busca por remetente, destinatarioNome, codigoRastreio

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string; // Ex: 'dataRecebimento'

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}


// encomendas/dto/encomenda-response.dto.ts
// Este DTO mapeia a entidade do Prisma para a resposta da API,
// ocultando campos internos se necessário ou formatando datas.
import { Exclude, Expose } from 'class-transformer';
import { Encomenda, StatusEncomenda, TipoEncomenda } from '@prisma/client';

export class EncomendaResponseDto {
  id: string;
  numeroProtocolo: string;
  tipo: TipoEncomenda;
  remetente?: string;
  transportadora?: string;
  codigoRastreio?: string;
  descricao?: string;
  destinatarioNome: string;
  destinatarioSetor?: string;
  destinatarioEmail: string;
  dataRecebimento: Date; // Pode ser formatado para string no interceptor
  recebidoPor: string;
  status: StatusEncomenda;
  dataEntrega?: Date;
  entreguePara?: string;
  entreguePor?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Encomenda>) {
    Object.assign(this, partial);
    // Exemplo de formatação ou exclusão sensível
    // this.dataRecebimento = new Date(partial.dataRecebimento).toISOString();
  }
}

// common/pagination/paginated-response.dto.ts (Genérico para qualquer lista paginada)
class PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}

// encomendas/dto/paginated-encomendas-response.dto.ts
import { PaginatedResponseDto } from '../../common/pagination/paginated-response.dto';
import { EncomendaResponseDto } from './encomenda-response.dto';

export class PaginatedEncomendasResponseDto extends PaginatedResponseDto<EncomendaResponseDto> {}
7. Regras de Autorização
Usaremos @nestjs/passport com JWT para autenticação e guards com @Roles decorator para autorização.

POST / (Registrar Recebimento): Apenas usuários autenticados com role: 'porteiro' ou role: 'admin'. O recebidoPor será automaticamente preenchido com o nome/email do usuário logado.
GET / (Listar Encomendas):
Porteiros/Administradores: Podem listar todas as encomendas.
Usuários Comuns: Podem listar apenas as encomendas onde destinatarioEmail é o seu próprio email.
GET /:id (Obter Encomenda por ID):
Porteiros/Administradores: Acesso total.
Usuários Comuns: Apenas se destinatarioEmail for o seu próprio email.
PATCH /:id/registrar-entrega (Registrar Entrega): Apenas usuários autenticados com role: 'porteiro' ou role: 'admin'. O entreguePor será automaticamente preenchido com o nome/email do usuário logado.
PATCH /:id/registrar-devolucao (Registrar Devolução): Apenas usuários autenticados com role: 'porteiro' ou role: 'admin'.
PUT /:id (Atualizar Encomenda): Apenas usuários autenticados com role: 'admin'.
DELETE /:id (Remover Encomenda): Apenas usuários autenticados com role: 'admin'.
8. Possíveis Tratamentos de Erro
400 Bad Request: Erros de validação (DTOs inválidos), corpo da requisição malformado.
401 Unauthorized: Token JWT ausente ou inválido.
403 Forbidden: Usuário autenticado, mas sem permissão para acessar o recurso ou executar a ação (ex: usuário comum tentando acessar encomenda de outro, ou registrar entrega sem ser porteiro/admin).
404 Not Found: Encomenda não encontrada pelo ID.
409 Conflict: Tentativa de registrar entrega/devolução em uma encomenda que já não está AGUARDANDO_RETIRADA.
500 Internal Server Error: Erros inesperados no servidor, problemas com o banco de dados (Prisma).
Usar um HttpExceptionFilter global no NestJS (common/filters/http-exception.filter.ts) para padronizar as respostas de erro.

9. Padrões de Organização (Use Cases, Services, Repositories)
Em NestJS, a estrutura padrão já se alinha bem com esses padrões:

Controller: Atua como a camada de interface (entrada/saída). Recebe requisições, valida DTOs e delega para o Service. Retorna DTOs de resposta.
Service (Use Cases): Contém a lógica de negócio central. Define os "Use Cases" da aplicação (ex: registrarRecebimento, registrarEntrega, listarEncomendas). No NestJS, @Injectable() Services são onde a maior parte da lógica de aplicação reside. Eles orquestram as operações, aplicando regras de negócio e chamando o Repository.
Repository: Abstrai a camada de persistência. No NestJS com Prisma, um EncomendasRepository (ou o próprio PrismaService se o projeto for menor) seria responsável por interagir diretamente com o PrismaClient para realizar operações CRUD na entidade Encomenda. Isso desacopla a lógica de negócio do banco de dados, facilitando a troca de ORM ou banco de dados no futuro.
Exemplo de fluxo:

EncomendasController recebe POST /api/encomendas com CreateEncomendaDto.
Validação de CreateEncomendaDto pelo ValidationPipe do NestJS.
Controller chama encomendasService.registrarRecebimento(createEncomendaDto, user).
encomendasService gera numeroProtocolo, define dataRecebimento e recebidoPor com base no user logado, aplica regras de negócio.
encomendasService chama encomendasRepository.create(data).
encomendasRepository usa prisma.encomenda.create(data) para salvar no banco.
A resposta é mapeada para EncomendaResponseDto e retornada.