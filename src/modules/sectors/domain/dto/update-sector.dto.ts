import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateSectorDto } from "./create-sector.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateSectorDto extends PartialType(CreateSectorDto) {
  @ApiProperty({
    description: "Nome do setor",
    example: "Financeiro",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
