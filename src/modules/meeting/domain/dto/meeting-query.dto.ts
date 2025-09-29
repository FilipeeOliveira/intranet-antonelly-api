import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { MeetingPriority, MeetingType } from './create-meeting.dto';

export class MeetingQueryDto {
    @ApiProperty({ description: 'Busca por assunto ou local', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filtro por tipo de reunião', enum: MeetingType, required: false })
    @IsOptional()
    @IsEnum(MeetingType)
    type?: MeetingType;

    @ApiProperty({ description: 'Filtro por prioridade', enum: MeetingPriority, required: false })
    @IsOptional()
    @IsEnum(MeetingPriority)
    priority?: MeetingPriority;

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

    @ApiProperty({ description: 'Campo para ordenação', enum: ['subject', 'date', 'priority', 'createdAt'], default: 'date', required: false })
    @IsOptional()
    sortBy: string = 'date';

    @ApiProperty({ description: 'Direção da ordenação', enum: ['asc', 'desc'], default: 'asc', required: false })
    @IsOptional()
    sortOrder: 'asc' | 'desc' = 'asc';
}
