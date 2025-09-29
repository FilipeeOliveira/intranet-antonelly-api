import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateVisitorDto, VisitorStatus } from './create-visitors.dto';


export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {
  @ApiProperty({ description: 'Nome do visitante', example: 'João da Silva', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'ID da empresa', example: 'uuid-da-empresa', required: false })
  @IsOptional()
  @IsUUID()
  companieId?: string;

  @ApiProperty({ description: 'Status do visitante', enum: VisitorStatus, required: false })
  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;
}
