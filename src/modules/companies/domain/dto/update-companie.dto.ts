import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCompanieDto } from './create-companie.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanieDto extends PartialType(CreateCompanieDto) {
  @ApiProperty({ description: 'Nome da empresa', example: 'ACME Ltda', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
