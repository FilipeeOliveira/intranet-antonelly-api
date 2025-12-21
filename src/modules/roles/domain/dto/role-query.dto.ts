import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";

export class RoleQueryDto {
  @ApiProperty({ description: "Busca por key ou descrição", required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: "Página", default: 1 })
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: "Limite por página", default: 10 })
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @ApiProperty({
    description: "Campo de ordenação",
    enum: ["key", "createdAt", "updatedAt"],
    default: "createdAt",
  })
  @IsOptional()
  @IsString()
  sortBy: "key" | "createdAt" | "updatedAt" = "createdAt";

  @ApiProperty({
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
    default: "desc",
  })
  @IsOptional()
  @IsString()
  sortOrder: "asc" | "desc" = "desc";
}
