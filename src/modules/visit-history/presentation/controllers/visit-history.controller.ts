import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { VisitHistoryService } from '../../application/services/visit-history.service';
import { EndVisitDto } from '../../domain/dto/end-visit.dto';
import { StartVisitDto } from '../../domain/dto/start-visit.dto';

@ApiTags('Histórico de Visitas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AuthenticateGuard)
@Controller('visit-history')
export class VisitHistoryController {
    constructor(private readonly visitHistoryService: VisitHistoryService) { }

    @Post('start')
    @ApiOperation({ summary: 'Iniciar uma nova visita' })
    @ApiResponse({ status: 201, description: 'Visita iniciada com sucesso.' })
    async startVisit(@Body() startVisitDto: StartVisitDto) {
        return this.visitHistoryService.startVisit(startVisitDto.visitorId);
    }

    @Patch('leave')
    @ApiOperation({ summary: 'Finalizar a visita de um visitante' })
    @ApiResponse({ status: 200, description: 'Visita finalizada com sucesso.' })
    async endVisit(@Body() endVisitDto: EndVisitDto) {
        return this.visitHistoryService.endVisit(endVisitDto.visitorId);
    }

    @Get('activity')
    @ApiOperation({ summary: 'Obter atividade de visitantes (presentes e do dia)' })
    @ApiResponse({ status: 200, description: 'Atividade de visitantes retornada com sucesso.' })
    async getVisitorsActivity() {
        return this.visitHistoryService.getVisitorsActivity();
    }
}
