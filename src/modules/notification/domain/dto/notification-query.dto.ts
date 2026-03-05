import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Max, Min } from "class-validator";

export class NotificationQueryDto {
  @ApiProperty({
    description: "Busca por titulo/assunto ou setor",
    required: false,
  })
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
    enum: ["title", "createdAt", "updatedAt"],
    default: "createdAt",
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy: string = "createdAt";

  @ApiProperty({
    description: "Filtrar por status de leitura",
    enum: ["read", "unread"],
    required: false,
  })
  @IsString()
  @IsOptional()
  read?: "read" | "unread";

  @ApiProperty({
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
    default: "desc",
    required: false,
  })
  @IsString()
  @IsOptional()
  sortOrder: "asc" | "desc" = "desc";
}
