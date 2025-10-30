-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visit_history" (
    "id" TEXT NOT NULL,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "visitorName" TEXT NOT NULL,
    "visitorCpf" TEXT NOT NULL,
    "visitorPhone" TEXT,
    "companyId" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "arrivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "visit_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "public"."companies"("cnpj");

-- AddForeignKey
ALTER TABLE "public"."visit_history" ADD CONSTRAINT "visit_history_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
