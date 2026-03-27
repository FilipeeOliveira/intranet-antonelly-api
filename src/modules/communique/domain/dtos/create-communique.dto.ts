import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommuniqueDto {
  @ApiProperty({
    description: "Título do comunicado",
    example: "Comunicado Importante",
  })
  @IsString({ message: "Título deve ser uma string" })
  @IsNotEmpty({ message: "Título é obrigatório" })
  title: string;

  @ApiProperty({
    description: "Descrição do comunicado",
    example: "Este é um comunicado importante para todos os funcionários.",
  })
  @IsString({ message: "Descrição deve ser uma string" })
  @IsNotEmpty({ message: "Descrição é obrigatória" })
  description: string;

  @ApiProperty({
    description: "Severidade do comunicado",
    example: "alta",
  })
  @IsString({ message: "Severity deve ser uma string" })
  @IsNotEmpty({ message: "Severity é obrigatória" })
  severity: string;

  @ApiProperty({
    description: "ID do autor do comunicado",
    example: "uuid-do-autor",
  })
  @IsString({ message: "AuthorId deve ser uma string" })
  @IsNotEmpty({ message: "AuthorId é obrigatório" })
  authorId: string;

  @ApiProperty({
    description: "ID do setor relacionado ao comunicado",
    example: "uuid-do-setor",
  })
  @IsString({ message: "sectorId deve ser uma string" })
  @IsNotEmpty({ message: "sectorId é obrigatório" })
  sectorId: string;

  @ApiProperty({
    description: "Imagem do comunicado",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  image?: Express.Multer.File;
}
