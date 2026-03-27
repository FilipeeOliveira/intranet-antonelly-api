import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateGuard } from "src/modules/auth/presentation/guards/authenticate.guard";
import { CurrentUser } from "src/modules/auth/presentation/decorators/current-user.decorator";
import { Features } from "src/modules/permissions/presentation/guards/features.decorator";
import { PermissionsGuard } from "src/modules/permissions/presentation/guards/permissions.guard";
import { Permissions } from "src/shared/features";
import { OrdersService } from "../../application/services/orders.service";
import { CreateOrderDto } from "../../domain/dto/create-order.dto";
import { ListOrdersDto } from "../../domain/dto/list-orders.dto";
import { RegisterReturnDto } from "../../domain/dto/register-return.dto";
import { RegisterDeliveryDto } from "../../domain/dto/register-delivery.dto";
import { UpdateOrderDto } from "../../domain/dto/update-order.dto";

@ApiTags("Encomendas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AuthenticateGuard, PermissionsGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Features(Permissions.ORDERS.WRITE)
  @ApiOperation({ summary: "Registrar recebimento de uma nova encomenda" })
  @ApiResponse({
    status: 201,
    description: "Encomenda registrada com sucesso.",
  })
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: { name: string }) {
    return this.ordersService.create(dto, user);
  }

  @Get()
  @Features(Permissions.ORDERS.READ)
  @ApiOperation({
    summary: "Listar encomendas (filtrado por permissão de acesso)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de encomendas retornada com sucesso.",
  })
  async findAll(@Query() query: ListOrdersDto, @CurrentUser() user: { role: string; email: string }) {
    return this.ordersService.findAll(query, user);
  }

  @Get(":id")
  @Features(Permissions.ORDERS.READ)
  @ApiOperation({ summary: "Buscar encomenda por ID" })
  @ApiResponse({ status: 200, description: "Encomenda retornada com sucesso." })
  async findById(@Param("id") id: string, @CurrentUser() user: { role: string; email: string }) {
    return this.ordersService.findById(id, user);
  }

  @Patch(":id/register-delivery")
  @Features(Permissions.ORDERS.WRITE)
  @ApiOperation({ summary: "Registrar entrega da encomenda ao destinatário" })
  @ApiResponse({ status: 200, description: "Entrega registrada com sucesso." })
  async registerDelivery(@Param("id") id: string, @Body() dto: RegisterDeliveryDto) {
    return this.ordersService.registerDelivery(id, dto);
  }

  @Patch(":id/register-return")
  @Features(Permissions.ORDERS.WRITE)
  @ApiOperation({ summary: "Registrar devolução da encomenda ao remetente" })
  @ApiResponse({
    status: 200,
    description: "Devolução registrada com sucesso.",
  })
  async registerReturn(@Param("id") id: string, @Body() dto: RegisterReturnDto) {
    return this.ordersService.registerReturn(id, dto);
  }

  @Put(":id")
  @Features(Permissions.ORDERS.WRITE)
  @ApiOperation({ summary: "Atualizar encomenda (Admin)" })
  @ApiResponse({
    status: 200,
    description: "Encomenda atualizada com sucesso.",
  })
  async update(@Param("id") id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(":id")
  @Features(Permissions.ORDERS.WRITE)
  @ApiOperation({ summary: "Excluir encomenda (Admin)" })
  @ApiResponse({ status: 200, description: "Encomenda excluída com sucesso." })
  async delete(@Param("id") id: string) {
    return this.ordersService.delete(id);
  }
}
