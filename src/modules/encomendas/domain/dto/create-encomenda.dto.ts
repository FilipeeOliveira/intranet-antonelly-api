import { ApiProperty } from '@nestjs/swagger';
import { TipoEncomenda } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEncomendaDto {
  @ApiProperty({ enum: TipoEncomenda, default: TipoEncomenda.ENCOMENDA })
  @IsEnum(TipoEncomenda)
  @IsNotEmpty()
  tipo: TipoEncomenda;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remetente?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transportadora?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  codigoRastreio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  destinatarioNome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  destinatarioSetor?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  destinatarioEmail: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
