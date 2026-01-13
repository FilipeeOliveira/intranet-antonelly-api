import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Features } from 'src/modules/permissions/presentation/guards/features.decorator';
import { PermissionsGuard } from 'src/modules/permissions/presentation/guards/permissions.guard';
import { Permissions } from 'src/shared/features';
import { SkipTemporaryPasswordCheck, TemporaryPasswordGuard } from '../../../auth/presentation/guards/temporary-password.guard';
import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/dto/update-user.dto';
import { UserQueryDto } from '../../domain/dto/user-query.dto';
import { PaginatedUsersResponseDto, UserResponseDto } from '../../domain/dto/user-response.dto';

@ApiTags('Gestão de Usuários')
@Controller('users')
@UseGuards(AuthGuard('jwt'), TemporaryPasswordGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Features(Permissions.USERS.READ)
  @Get()
  @ApiOperation({ summary: 'Listar usuários com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: PaginatedUsersResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(query);
  }

  @Features(Permissions.USERS.READ)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Features(Permissions.USERS.WRITE)
  @Post()
  @SkipTemporaryPasswordCheck()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 criações por minuto
  @ApiOperation({ summary: 'Criar novo usuário com senha temporária' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso. Senha temporária enviada por email.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Features(Permissions.USERS.WRITE)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Features(Permissions.USERS.WRITE)
  @Put(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 resets por 5 minutos
  @ApiOperation({ summary: 'Resetar senha do usuário (apenas admin)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Senha resetada com sucesso. Nova senha temporária enviada.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async resetPassword(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.resetPassword(id);
  }

  @Features(Permissions.USERS.WRITE)
  @Put(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Status do usuário alterado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async toggleStatus(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.toggleStatus(id);
  }

  @Features(Permissions.USERS.WRITE)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 exclusões por 5 minutos
  @ApiOperation({ summary: 'Excluir usuário (hard delete)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas administradores' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}