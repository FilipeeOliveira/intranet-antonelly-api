import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { DashboardService } from "../../application/services/dashboard.service";

@ApiTags("Dashboard")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  @ApiOperation({
    summary: "Retorna o resumo do dashboard com contagens de hoje e ontem",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo do dashboard retornado com sucesso.",
    schema: {
      example: {
        communiques: { today: 8, yesterday: 5, newLast7Days: 12 },
        documents: { today: 24, yesterday: 12 },
        visitorsPresent: { today: 3, yesterday: 8 },
        reservations: { today: 4, yesterday: 2 },
      },
    },
  })
  async getSummary() {
    return this.dashboardService.getSummary();
  }
}
