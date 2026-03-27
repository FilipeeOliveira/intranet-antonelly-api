import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Max, Min } from "class-validator";

export class RoomsQueryDto {
  @ApiProperty({ description: "Busca por nome ou local", required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: "Número da página", default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: "Limite por página",
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({
    description: "Campo para ordenação",
    enum: ["id", "name", "location", "createdAt"],
    default: "createdAt",
    required: false,
  })
  @IsOptional()
  sortBy: string = "createdAt";

  @ApiProperty({
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
    default: "desc",
    required: false,
  })
  @IsOptional()
  sortOrder: "asc" | "desc" = "desc";
}
