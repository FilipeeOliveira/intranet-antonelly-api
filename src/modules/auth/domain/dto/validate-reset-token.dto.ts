import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateResetTokenDto {
  @ApiProperty({
    description: "Token de recuperação de senha recebido por email",
  })
  @IsString()
  @IsNotEmpty({ message: "Token é obrigatório" })
  token: string;
}
