import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class RegisterReturnDto {
  @ApiProperty({
    required: false,
    description: "Motivo ou observação da devolução",
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
