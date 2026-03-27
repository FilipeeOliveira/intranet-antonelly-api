import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";
import { ConstructionCategory, ConstructionStatus } from "@prisma/client";

export class CreateConstructionDto {
  @ApiProperty({ description: "Nome da obra", example: "Reforma Sede Central" })
  @IsString()
  @IsNotEmpty({ message: "Nome da obra é obrigatório" })
  name: string;

  @ApiProperty({
    description: "Categoria da obra",
    enum: ConstructionCategory,
    default: ConstructionCategory.OBRAS,
    required: false,
  })
  @IsEnum(ConstructionCategory)
  @IsOptional()
  category?: ConstructionCategory = ConstructionCategory.OBRAS;

  @ApiProperty({ description: "Descrição da obra", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Endereço da obra", required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: "Cliente da obra", required: false })
  @IsString()
  @IsOptional()
  client?: string;

  @ApiProperty({ description: "Responsável pela obra", required: false })
  @IsString()
  @IsOptional()
  responsible?: string;

  @ApiProperty({
    description: "Data de início (ISO 8601)",
    example: "2026-01-01T00:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty({ message: "Data de início é obrigatória" })
  startDate: string;

  @ApiProperty({
    description: "Data fim prevista (ISO 8601)",
    example: "2026-12-31T00:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty({ message: "Data fim prevista é obrigatória" })
  expectedEndDate: string;

  @ApiProperty({
    description: "Valor do contrato",
    example: 150000.0,
    required: false,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== null ? parseFloat(value) : undefined))
  contractValue?: number;

  @ApiProperty({
    description: "Status inicial da obra",
    enum: ConstructionStatus,
    default: ConstructionStatus.planning,
    required: false,
  })
  @IsEnum(ConstructionStatus)
  @IsOptional()
  status?: ConstructionStatus = ConstructionStatus.planning;

  @ApiProperty({ description: "URL da imagem da obra", required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
