-- CreateEnum
CREATE TYPE "public"."TipoEncomenda" AS ENUM ('ENCOMENDA', 'CARTA', 'DOCUMENTO', 'PACOTE', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."StatusEncomenda" AS ENUM ('AGUARDANDO_RETIRADA', 'ENTREGUE', 'DEVOLVIDO');

-- CreateTable
CREATE TABLE "public"."encomendas" (
    "id" TEXT NOT NULL,
    "numeroProtocolo" TEXT NOT NULL,
    "tipo" "public"."TipoEncomenda" NOT NULL DEFAULT 'ENCOMENDA',
    "remetente" VARCHAR(255),
    "transportadora" VARCHAR(255),
    "codigoRastreio" VARCHAR(255),
    "descricao" TEXT,
    "destinatarioNome" VARCHAR(255) NOT NULL,
    "destinatarioSetor" VARCHAR(255),
    "destinatarioEmail" VARCHAR(255) NOT NULL,
    "dataRecebimento" TIMESTAMP(3) NOT NULL,
    "recebidoPor" VARCHAR(255) NOT NULL,
    "status" "public"."StatusEncomenda" NOT NULL DEFAULT 'AGUARDANDO_RETIRADA',
    "dataEntrega" TIMESTAMP(3),
    "entreguePara" VARCHAR(255),
    "entreguePor" VARCHAR(255),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encomendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "encomendas_numeroProtocolo_key" ON "public"."encomendas"("numeroProtocolo");
