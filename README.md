<h1 align="center" > NestJS REST API </h1>

<p align="center">
<img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

## Descrição

**`NestJS REST API`** com autenticação JWT.

Este **`NestJS REST API`** foi projetado para dar um impulso inicial ao seu processo de desenvolvimento com um sistema de autenticação de usuário robusto e rotas protegidas. Construído usando Nest.js, Prisma e Postgres, este modelo fornece recursos essenciais, como registro de usuário, login, autenticação JWT e uma API CRUD para gerenciar usuários. A API também é totalmente documentada usando Swagger para fácil integração e compreensão.

## Tecnologias usadas

- Nest.js: uma estrutura progressiva do Node.js para criar aplicativos do lado do servidor eficientes, confiáveis ​​e escaláveis.

- Prisma: kit de ferramentas de banco de dados moderno para Node.js e TypeScript, fornecendo acesso e migrações de banco de dados com segurança de tipo.

- Postgres: poderoso sistema de banco de dados relacional de código aberto para armazenar e gerenciar dados com segurança.

- JWT: tokens da Web JSON para autenticação e autorização seguras.



## Primeiros Passos

### 1. Clone o repositório
```bash
git clone https://github.com/FilipeeOliveira/intranet-antonelly-api
```

### 2. Atualize o arquivo `.env`
Veja o arquivo `.env.example` para mais informações sobre como configurar seu ambiente.

### 3. Inicie o contêiner do banco de dados
Certifique-se de que o Docker Desktop esteja aberto e em execução. Em seguida, inicie o contêiner:
```bash
docker compose up -d
```

### 4. Entre no Ambiente de Desenvolvimento Node

Acesse o ambiente de desenvolvimento Node.js com:

```bash
docker compose exec api bash
```

### 5. Instale as dependências
```bash
npm install
```

### 6. Crie as tabelas do banco de dados
Com o contêiner do banco de dados em funcionamento, crie as tabelas:
```bash
npx prisma migrate dev --name "Nome do Schema"
```

### 7. Preencha as tabelas do banco de dados
O script de seed criará usuários de teste com diferentes perfis. A senha padrão é `AdminPass@123`.
```bash
npm run seed
```

### 8. Execute o servidor de desenvolvimento
Agora, você pode rodar o servidor:
```bash
npm run start:dev
```

## Documentação

### Swagger

Você também pode acessar a documentação do Swagger com a REST API em execução localmente visitando <a href="http://localhost:3000/api" >http://localhost:3005/api</a>.

## Licença
Este projeto é licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

