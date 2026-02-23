import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { Permissions } from 'src/shared/features';
import { PermissionsService } from '../../application/services/permissions.service';
import { Features } from '../guards/features.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';

@ApiTags('Permissões')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    /**
     * Endpoint para o usuário buscar suas próprias permissões.
     * NÃO requer permissão especial - apenas autenticação.
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    @ApiOperation({ summary: 'Busca as permissões do usuário autenticado' })
    getMyPermissions(@Req() req: any) {
        return this.permissionsService.getUserPermissions(req.user.id);
    }

    /**
     * Endpoint para o usuário buscar suas próprias features.
     * NÃO requer permissão especial - apenas autenticação.
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('me/features')
    @ApiOperation({ summary: 'Busca as features do usuário autenticado' })
    getMyFeatures(@Req() req: any) {
        return this.permissionsService.getUserFeatures(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.WRITE, Permissions.USERS.WRITE)
    @Post('user/:id')
    setUserPermissions(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body('featureIds') featureIds: string[],
        @Req() req: any,
    ) {
        return this.permissionsService.setUserPermissions(userId, featureIds, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.READ, Permissions.USERS.READ)
    @Get('user/:id')
    getUserPermissions(@Param('id', ParseUUIDPipe) userId: string) {
        return this.permissionsService.getUserPermissions(userId);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.READ, Permissions.USERS.READ)
    @Get('user/:id/features')
    getUserFeatures(@Param('id', ParseUUIDPipe) userId: string) {
        return this.permissionsService.getUserFeatures(userId);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.WRITE, Permissions.USERS.WRITE)
    @Post('user/:id/feature/:featureId')
    assignFeature(
        @Param('id', ParseUUIDPipe) userId: string,
        @Param('featureId', ParseUUIDPipe) featureId: string,
    ) {
        return this.permissionsService.assignFeature(userId, featureId);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.READ, Permissions.USERS.READ)
    @Get('pages')
    getPages(@Query('includeHidden') includeHidden?: string) {
        return this.permissionsService.getAllPagesWithFeatures(includeHidden === 'true');
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.WRITE, Permissions.USERS.WRITE)
    @Delete('user/:id/feature/:featureId')
    revokeFeature(
        @Param('id', ParseUUIDPipe) userId: string,
        @Param('featureId', ParseUUIDPipe) featureId: string,
        @Req() req: any,
    ) {
        return this.permissionsService.revokeFeature(userId, featureId, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.WRITE, Permissions.USERS.WRITE)
    @Post('user/:id/features')
    assignManyFeatures(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body('featureIds') featureIds: string[],
    ) {
        return this.permissionsService.assignManyFeatures(userId, featureIds);
    }

    @UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
    @Features(Permissions.PERMISSIONS.WRITE, Permissions.USERS.WRITE)
    @Delete('user/:id/features')
    revokeManyFeatures(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body('featureIds') featureIds: string[],
        @Req() req: any,
    ) {
        return this.permissionsService.revokeManyFeatures(userId, featureIds, req.user.id);
    }
}
