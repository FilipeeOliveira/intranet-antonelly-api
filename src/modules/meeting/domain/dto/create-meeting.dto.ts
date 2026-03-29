import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMeetingDto {
  @ApiProperty({ description: "Assunto da reunião", example: "Revisão do Sprint" })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: "Descrição da reunião", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Setor responsável pela reunião", example: "TI", required: false })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({ description: "Nome do responsável pela reunião", example: "Filipe Oliveira", required: false })
  @IsOptional()
  @IsString()
  responsible?: string;

  @ApiProperty({ description: "Data da reunião (YYYY-MM-DD)", example: "2026-03-27" })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: "Horário de início (HH:MM)", example: "10:00" })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ description: "Horário de término (HH:MM)", example: "11:00" })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ description: "ID da sala", example: "uuid-da-sala" })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
