import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { MeetingStatus } from '../enums/MeetingStatus';

export class MeetingQueryDto {
    @ApiProperty({ description: 'Busca por titulo/assunto ou setor', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Número da página', default: 1, required: false })
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    page: number = 1;

    @ApiProperty({ description: 'Limite por página', default: 10, required: false })
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiProperty({ description: 'Campo para ordenação', enum: ['subject', 'date', 'sector', 'createdAt'], default: 'createdAt', required: false })
    @IsString()
    @IsOptional()
    sortBy: string = 'createdAt';

    @ApiProperty({ description: 'Direção da ordenação', enum: ['asc', 'desc'], default: 'desc', required: false })
    @IsString()
    @IsOptional()
    sortOrder: 'asc' | 'desc' = 'desc';

    @ApiProperty({ description: 'Filtrar por ID da sala', required: false })
    @IsOptional()
    @IsString()
    roomId?: string;

    @ApiProperty({ description: 'Filtrar por status da reunião', enum: MeetingStatus, required: false })
    @IsOptional()
    @IsEnum(MeetingStatus)
    status?: MeetingStatus;

    @ApiProperty({ description: 'Filtrar por data inicial', required: false })
    @IsOptional()
    @IsString()
    startDate?: string;
}
