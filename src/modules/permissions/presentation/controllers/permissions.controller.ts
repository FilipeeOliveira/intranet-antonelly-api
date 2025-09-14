import { Controller, Get, Post, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { PermissionsService } from '../../application/services/permissions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissões')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

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

    @Post('user/:id/feature/:featureId')
    assignFeature(
        @Param('id') userId: string,
        @Param('featureId') featureId: string,
    ) {
        return this.permissionsService.assignFeature(userId, featureId);
    }

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
