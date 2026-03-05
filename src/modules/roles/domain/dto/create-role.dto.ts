import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "ADMIN" })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: "Administrador do sistema" })
  @IsString()
  @IsNotEmpty()
  description: string;
}
