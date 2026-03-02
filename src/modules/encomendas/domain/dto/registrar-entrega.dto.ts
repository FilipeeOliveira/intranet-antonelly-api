import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrarEntregaDto {
  @ApiProperty({ description: 'Nome de quem retirou a encomenda' })
  @IsString()
  @IsNotEmpty()
  entreguePara: string;
}
