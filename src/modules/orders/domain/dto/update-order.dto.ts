import { ApiProperty, PartialType } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
