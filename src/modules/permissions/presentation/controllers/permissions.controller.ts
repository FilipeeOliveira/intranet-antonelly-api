import { Controller, Get, Post, Delete, Param, ParseIntPipe, Body, UseGuards } from '@nestjs/common';
import { PermissionsService } from '../../application/services/permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Features } from '../guards/features.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiTags('Permissões')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Features('PERMISSION_CREATE')
    @Post('user/:id')
    setUserPermissions(
        @Param('id', ParseIntPipe) userId: string,
        @Body('featureIds') featureIds: string[],
    ) {
        return this.permissionsService.setUserPermissions(userId, featureIds);
    }

    @Get('user/:id')
    getUserPermissions(@Param('id') userId: string) {
        return this.permissionsService.getUserPermissions(userId);
    }

    @Features('PERMISSION_ASSOCIATION')
    @Post('user/:id/feature/:featureId')
    assignFeature(
        @Param('id') userId: string,
        @Param('featureId') featureId: string,
    ) {
        return this.permissionsService.assignFeature(userId, featureId);
    }

    @Features('PERMISSION_VIEW')
    @Get('pages')
    getPages() {
        return this.permissionsService.getAllPagesWithFeatures();
    }


    @Delete('user/:id/feature/:featureId')
    revokeFeature(
        @Param('id') userId: string,
        @Param('featureId') featureId: string,
    ) {
        return this.permissionsService.revokeFeature(userId, featureId);
    }
}
