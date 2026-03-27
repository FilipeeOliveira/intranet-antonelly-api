import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ description: "Nome da empresa", example: "ACME Corp" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "CNPJ da empresa",
    example: "12345678000123",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  cnpj: string;
}
