import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, Max, Min } from "class-validator";

export class CommuniqueQueryDto {
  @ApiProperty({
    description: "Busca por título, descrição, severidade ou autor do comunicado",
    required: false,
    example: "Comunicado Importante",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Filtro por nome do setor",
    required: false,
    example: "RH",
  })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({
    description: "Filtro por ID do setor (UUID)",
    required: false,
    example: "0801b5e5-6aa4-4ec3-9742-5a48419a4104",
  })
  @IsOptional()
  @IsString()
  sectorId?: string;

  @ApiProperty({
    description: "Número da página",
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Limite de registros por página",
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: "Campo para ordenação",
    enum: ["title", "severity", "createdAt"],
    default: "title",
    required: false,
  })
  @IsOptional()
  @IsEnum(["title", "severity", "createdAt"])
  sortBy?: string = "createdAt";

  @ApiProperty({
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
    default: "desc",
    required: false,
  })
  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
