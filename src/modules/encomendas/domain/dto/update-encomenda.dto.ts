import { ApiProperty, PartialType } from '@nestjs/swagger';
import { StatusEncomenda } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateEncomendaDto } from './create-encomenda.dto';

export class UpdateEncomendaDto extends PartialType(CreateEncomendaDto) {
  @ApiProperty({ enum: StatusEncomenda, required: false })
  @IsOptional()
  @IsEnum(StatusEncomenda)
  status?: StatusEncomenda;
}
