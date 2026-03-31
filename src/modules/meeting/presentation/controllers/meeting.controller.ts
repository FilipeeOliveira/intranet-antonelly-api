import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { MeetingService } from "../../application/service/meeting.service";
import { MeetingPresenter } from "../presenters/meeting.presenter";
import { CreateMeetingDto } from "../../domain/dto/create-meeting.dto";
import { MeetingQueryDto } from "../../domain/dto/meeting-query.dto";
import { UpdateMeetingDto } from "../../domain/dto/update-meeting.dto";

@ApiTags("Agendamento de Reuniões")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("meetings")
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Features(Permissions.MEETINGS.WRITE)
  @Post()
  @ApiOperation({ summary: "Agendar nova reunião" })
  @ApiResponse({ status: 201, description: "Reunião agendada com sucesso." })
  async create(@Body() dto: CreateMeetingDto) {
    const meeting = await this.meetingService.create(dto);
    return MeetingPresenter.present(meeting);
  }

  @Features(Permissions.MEETINGS.READ)
  @Get()
  @ApiOperation({ summary: "Listar reuniões com filtros e paginação" })
  @ApiResponse({ status: 200, description: "Lista de reuniões retornada com sucesso." })
  async findAll(@Query() query: MeetingQueryDto) {
    const result = await this.meetingService.findAll(query);
    return MeetingPresenter.presentPaginated(result);
  }

  @Features(Permissions.MEETINGS.READ)
  @Get("today")
  @ApiOperation({ summary: "Listar reuniões de hoje" })
  @ApiResponse({ status: 200, description: "Lista de reuniões de hoje retornada com sucesso." })
  async findToday() {
    const meetings = await this.meetingService.findToday();
    return MeetingPresenter.presentMany(meetings);
  }

  @Features(Permissions.MEETINGS.READ)
  @Get(":id")
  @ApiOperation({ summary: "Buscar reunião por ID" })
  @ApiResponse({ status: 200, description: "Reunião encontrada." })
  @ApiResponse({ status: 404, description: "Reunião não encontrada." })
  async findById(@Param("id") id: string) {
    const meeting = await this.meetingService.findById(id);
    return MeetingPresenter.present(meeting);
  }

  @Features(Permissions.MEETINGS.WRITE)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar reunião (apenas AGENDADAS)" })
  @ApiResponse({ status: 200, description: "Reunião atualizada com sucesso." })
  async update(@Param("id") id: string, @Body() dto: UpdateMeetingDto) {
    const meeting = await this.meetingService.update(id, dto);
    return MeetingPresenter.present(meeting);
  }

  @Features(Permissions.MEETINGS.WRITE)
  @Delete(":id")
  @ApiOperation({
    summary: "Cancelar reunião (soft delete)",
    description: "Cancela logicamente a reunião. Só é permitido para reuniões com status AGENDADO.",
  })
  @ApiResponse({ status: 200, description: "Reunião cancelada com sucesso." })
  async delete(@Param("id") id: string) {
    return this.meetingService.delete(id);
  }

  @Features(Permissions.MEETINGS.WRITE)
  @Patch("start/:id")
  @ApiOperation({
    summary: "Iniciar reunião manualmente",
    description: "Inicia uma reunião agendada. Só é permitido no dia agendado e dentro da janela de horário.",
  })
  @ApiResponse({ status: 200, description: "Reunião iniciada com sucesso." })
  async start(@Param("id") id: string) {
    const meeting = await this.meetingService.start(id);
    return MeetingPresenter.present(meeting);
  }

  @Features(Permissions.MEETINGS.WRITE)
  @Patch("finish/:id")
  @ApiOperation({
    summary: "Finalizar reunião manualmente",
    description: "Finaliza uma reunião em andamento. Preserva o horário agendado (endTime) e salva o horário real de fim (actualEndAt).",
  })
  @ApiResponse({ status: 200, description: "Reunião finalizada com sucesso." })
  async finish(@Param("id") id: string) {
    const meeting = await this.meetingService.finish(id);
    return MeetingPresenter.present(meeting);
  }
}
