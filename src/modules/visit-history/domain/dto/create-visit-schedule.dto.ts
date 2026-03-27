import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateVisitScheduleDto {
  @ApiProperty({
    description: "Full name of the visitor",
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  visitorName: string;

  @ApiProperty({
    description: "ID of the company being visited",
    example: "e2e47e4f-cc59-44b8-9b7f-247b3e3e4af8",
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({
    description: "Reason or description of the visit",
    example: "Meeting with the logistics team",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Date of the visit (ISO format)",
    example: "2025-10-15",
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: "Scheduled time for the visit (HH:mm)",
    example: "14:30",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in the format HH:mm",
  })
  time: string;

  @ApiProperty({
    description: "CPF of the visitor",
    example: "123.456.789-00",
  })
  @IsOptional()
  @IsString()
  visitorCpf?: string;

  @ApiProperty({
    description: "Phone number of the visitor",
    example: "(99) 9 9999-9999",
  })
  @IsOptional()
  @IsString()
  visitorPhone?: string;
}
