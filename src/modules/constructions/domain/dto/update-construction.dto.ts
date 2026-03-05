import { PartialType } from "@nestjs/swagger";
import { CreateConstructionDto } from "./create-construction.dto";

export class UpdateConstructionDto extends PartialType(CreateConstructionDto) {}
