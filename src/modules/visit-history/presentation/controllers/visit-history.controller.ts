import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { VisitHistoryService } from "../../application/services/visit-history.service";
import { CreateVisitHistoryDto } from "../../domain/dto/create-visit-history.dto";
import { CreateVisitScheduleDto } from "../../domain/dto/create-visit-schedule.dto";
import { EndVisitDto } from "../../domain/dto/end-visit.dto";
import { StartVisitDto } from "../../domain/dto/start-visit.dto";
import { VisitHistoryQueryDto } from "../../domain/dto/visit-history-query.dto";

@ApiTags("Histórico de Visitas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("visit-history")
export class VisitHistoryController {
  constructor(private readonly visitHistoryService: VisitHistoryService) {}

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Post("schedule")
  @ApiOperation({ summary: "Agendar uma visita para um visitante" })
  @ApiResponse({ status: 201, description: "Visita agendada com sucesso." })
  async scheduleVisit(@Body() createVisitScheduleDto: CreateVisitScheduleDto) {
    return this.visitHistoryService.createVisitSchedule(createVisitScheduleDto);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Post("add")
  @ApiOperation({ summary: "Adicionar um novo registro de visita" })
  @ApiResponse({
    status: 201,
    description: "Registro de visita adicionado com sucesso.",
  })
  async addVisitRecord(@Body() createVisitHistoryDto: CreateVisitHistoryDto) {
    return this.visitHistoryService.create(createVisitHistoryDto);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Patch("start")
  @ApiOperation({ summary: "Iniciar uma nova visita" })
  @ApiResponse({ status: 201, description: "Visita iniciada com sucesso." })
  async startVisit(@Body() startVisitDto: StartVisitDto) {
    return this.visitHistoryService.startVisit(startVisitDto.visitHistoryId);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Patch("leave")
  @ApiOperation({ summary: "Finalizar a visita de um visitante" })
  @ApiResponse({ status: 200, description: "Visita finalizada com sucesso." })
  async endVisit(@Body() endVisitDto: EndVisitDto) {
    return this.visitHistoryService.endVisit(endVisitDto.visitHistoryId);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Patch("cancel/:id")
  @ApiOperation({ summary: "Cancelar uma visita agendada pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Visita agendada cancelada com sucesso.",
  })
  async cancelScheduledVisit(@Param("id") id: string) {
    return this.visitHistoryService.cancelScheduledVisit(id);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar um registro de visita pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Registro de visita atualizado com sucesso.",
  })
  async updateVisitRecord(@Param("id") id: string, @Body() updateData: Partial<CreateVisitHistoryDto>) {
    return await this.visitHistoryService.update(id, updateData);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.READ)
  @Get()
  @ApiOperation({ summary: "Obter histórico de visitas com filtros" })
  @ApiResponse({
    status: 200,
    description: "Histórico de visitas retornado com sucesso.",
  })
  async getVisitHistory(@Query() query: VisitHistoryQueryDto) {
    return this.visitHistoryService.findAll(query);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.READ)
  @Get("total-count")
  @ApiOperation({ summary: "Obter a contagem total de registros de visita" })
  @ApiResponse({
    status: 200,
    description: "Contagem total de registros de visita retornada com sucesso.",
  })
  async getTotalVisitCount() {
    return this.visitHistoryService.getTotalCount();
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.READ)
  @Get(":id")
  @ApiOperation({ summary: "Obter um registro de visita pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Registro de visita retornado com sucesso.",
  })
  async getVisitRecordById(@Param("id") id: string) {
    return await this.visitHistoryService.findById(id);
  }

  @Features(Permissions.VISIT_HISTORY_GENERAL.WRITE)
  @Delete(":id")
  @ApiOperation({ summary: "Excluir um registro de visita pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Registro de visita excluído com sucesso.",
  })
  async deleteVisitRecord(@Param("id") id: string) {
    return await this.visitHistoryService.delete(id);
  }
}
