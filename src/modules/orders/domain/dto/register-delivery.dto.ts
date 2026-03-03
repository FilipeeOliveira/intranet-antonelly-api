import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class RegisterDeliveryDto {
  @ApiProperty({ description: 'Nome de quem retirou a encomenda' })
  @IsString()
  @IsNotEmpty()
  deliveredTo: string;

  @ApiProperty({ description: 'Nome de quem entregou a encomenda' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  deliveredBy: string;
}
