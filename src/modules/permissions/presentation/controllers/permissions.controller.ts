import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from '../../application/services/permissions.service';
import { Features } from '../guards/features.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticateGuard } from 'src/modules/auth/presentation/guards/authenticate.guard';
import { Permissions } from 'src/shared/features';

@UseGuards(AuthGuard('jwt'), AuthenticateGuard, PermissionsGuard)
@ApiTags('Permissões')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Features(Permissions.PERMISSIONS.ASSIGN_USER)
    @Post('user/:id')
    setUserPermissions(
        @Param('id', ParseIntPipe) userId: string,
        @Body('featureIds') featureIds: string[],
    ) {
        return this.permissionsService.setUserPermissions(userId, featureIds);
    }

    @Features(Permissions.PERMISSIONS.READ_FEATURES_BY_USER_ID, Permissions.PERMISSIONS.READ)
    @Get('user/:id')
    getUserPermissions(@Param('id') userId: string) {
        return this.permissionsService.getUserPermissions(userId);
    }

    @Features(Permissions.PERMISSIONS.READ_FEATURES_BY_USER_ID, Permissions.PERMISSIONS.READ)
    @Get('user/:id/features')
    getUserFeatures(@Param('id') userId: string) {
        return this.permissionsService.getUserFeatures(userId);
    }

    @Features(Permissions.PERMISSIONS.ASSIGN_USER)
    @Post('user/:id/feature/:featureId')
    assignFeature(
        @Param('id') userId: string,
        @Param('featureId') featureId: string,
    ) {
        return this.permissionsService.assignFeature(userId, featureId);
    }

    @Features(Permissions.PERMISSIONS.READ_ALL_PAGES_WITH_FEATURES, Permissions.PERMISSIONS.READ)
    @Get('pages')
    getPages() {
        return this.permissionsService.getAllPagesWithFeatures();
    }

    @Features(Permissions.PERMISSIONS.REVOKE_USER_FEATURE)
    @Delete('user/:id/feature/:featureId')
    revokeFeature(
        @Param('id') userId: string,
        @Param('featureId') featureId: string,
    ) {
        return this.permissionsService.revokeFeature(userId, featureId);
    }
}
