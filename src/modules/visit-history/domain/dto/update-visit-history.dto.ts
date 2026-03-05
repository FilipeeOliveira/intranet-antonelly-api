import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateVisitHistoryDto } from "./create-visit-history.dto";

export class UpdateVisitHistoryDto extends PartialType(CreateVisitHistoryDto) {
  @ApiProperty({
    description: "Data e hora de saída",
    example: "2025-09-28T12:30:00Z",
    required: false,
  })
  @IsOptional()
  leftAt?: Date;
}
