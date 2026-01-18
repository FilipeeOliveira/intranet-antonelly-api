<h1 align="center">SIAN API - Sistema Interno Antonelly</h1>

<p align="center">
<img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

## 📋 Sobre o Projeto

**SIAN (Sistema Interno Antonelly)** é uma API REST desenvolvida com NestJS que oferece a infraestrutura backend para o sistema interno corporativo da empresa Antonelly.

### Funcionalidades

- **Controle de Acesso (Portaria)**: Sistema completo de gestão de visitantes e funcionários
- **Gerenciamento de Usuários**: CRUD completo com controle de permissões e setores
- **Histórico de Visitas**: Registro e acompanhamento de todas as visitas realizadas
- **Autenticação Segura**: Sistema robusto de autenticação JWT com diferentes níveis de acesso
- **Documentação Swagger**: API totalmente documentada para fácil integração
- **Arquitetura Modular**: Estrutura preparada para expansão de funcionalidades

## 🚀 Tecnologias Utilizadas

- **NestJS**: Framework progressivo do Node.js para criar aplicações server-side eficientes e escaláveis
- **Prisma**: ORM moderno com segurança de tipo para Node.js e TypeScript
- **PostgreSQL**: Sistema de banco de dados relacional robusto e confiável
- **JWT**: Autenticação e autorização seguras com JSON Web Tokens
- **Docker**: Containerização para ambiente de desenvolvimento consistente
- **Swagger**: Documentação interativa da API
- **TypeScript**: Superset JavaScript com tipagem estática



## ⚙️ Primeiros Passos

### 1. Clone o repositório
```bash
git clone https://github.com/FilipeeOliveira/intranet-antonelly-api
```

### 2. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env
```
Atualize as variáveis conforme necessário.

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
O script de seed criará usuários de teste com diferentes perfis. A senha padrão é `admin@123`.
```bash
npm run seed
```

### 8. Execute o servidor de desenvolvimento
Agora, você pode rodar o servidor:
```bash
npm run start:dev
```

## 📚 Documentação

### Swagger

Você também pode acessar a documentação do Swagger com a REST API em execução localmente visitando [http://localhost:3005/api](http://localhost:3005/api).

## 📁 Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── users/          # Gerenciamento de usuários
├── visitors/       # Gestão de visitantes
├── visit-history/  # Histórico de visitas
├── prisma/         # Schema e configurações do Prisma
└── common/         # Utilitários e recursos compartilhados
```

## 🔐 Usuários Padrão

Após executar o seed, os seguintes usuários estarão disponíveis:

- **Admin**: Acesso total ao sistema
- **Portaria**: Acesso ao controle de visitantes
- **Usuário Comum**: Acesso limitado

## 📝 Licença

Este é um projeto interno da empresa Antonelly.


