import { Module } from "@nestjs/common";
import { CompanyController } from "./presentation/controllers/company.controller";
import { CompanyService } from "./application/services/companie.service";
import { CompanyRepository } from "./infrastructure/repositories/company.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompaniesModule {}
