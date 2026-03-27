import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ConstructionStatus } from "@prisma/client";

export class UpdateConstructionStatusDto {
  @ApiProperty({
    description: "Novo status da obra",
    enum: ConstructionStatus,
  })
  @IsEnum(ConstructionStatus)
  @IsNotEmpty()
  status: ConstructionStatus;
}
