import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { ConstructionCategory, ConstructionStatus } from "@prisma/client";

export class FilterConstructionDto {
  @ApiProperty({ description: "Busca por nome ou cliente", required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Filtrar por categoria",
    enum: ConstructionCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(ConstructionCategory)
  category?: ConstructionCategory;

  @ApiProperty({
    description: "Filtrar por status",
    enum: ConstructionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ConstructionStatus)
  status?: ConstructionStatus;

  @ApiProperty({
    description: "Campo de ordenação",
    enum: ["date", "name", "status"],
    default: "date",
    required: false,
  })
  @IsOptional()
  @IsEnum(["date", "name", "status"])
  orderBy?: "date" | "name" | "status" = "date";

  @ApiProperty({ description: "Número da página", default: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Limite por página",
    default: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
