import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateRoomDto {
  @ApiProperty({
    description: "Nome da sala",
    example: "Sala de Reuniões 1",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Localização da sala",
    example: "1º Andar - Ala A",
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: "Capacidade da sala",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(2)
  capacity?: number;
}
