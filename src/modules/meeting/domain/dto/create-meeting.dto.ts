import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MeetingDuration {
    MIN_15 = 'MIN_15',
    MIN_30 = 'MIN_30',
    MIN_45 = 'MIN_45',
    H_1 = 'H_1',
    H_1_30 = 'H_1_30',
    H_2 = 'H_2',
    H_3 = 'H_3',
}

export enum MeetingType {
    INLOCAL = 'INLOCAL',
    ONLINE = 'ONLINE',
}

export enum MeetingPriority {
    LOW = 'LOW',
    MID = 'MID',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum MeetingReminder {
    NOT = 'NOT',
    MIN_5 = 'MIN_5',
    MIN_15 = 'MIN_15',
    MIN_30 = 'MIN_30',
    H_1 = 'H_1',
    D_1 = 'D_1',
}

export class CreateMeetingDto {
    @ApiProperty({ description: 'Assunto da reunião', example: 'Revisão do Sprint' })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({ description: 'Data da reunião (YYYY-MM-DD)', example: '2025-10-01' })
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @ApiProperty({ description: 'Horário da reunião (HH:MM)', example: '14:30' })
    @IsNotEmpty()
    @IsString()
    time: string;

    @ApiProperty({ description: 'Duração da reunião', enum: MeetingDuration })
    @IsEnum(MeetingDuration)
    duration: MeetingDuration;

    @ApiProperty({ description: 'Participantes (nomes separados por vírgula)', example: 'João, Maria, Pedro' })
    @IsNotEmpty()
    @IsString()
    participants: string;

    @ApiProperty({ description: 'Tipo de reunião', enum: MeetingType })
    @IsEnum(MeetingType)
    type: MeetingType;

    @ApiProperty({ description: 'Prioridade da reunião', enum: MeetingPriority })
    @IsEnum(MeetingPriority)
    priority: MeetingPriority;

    @ApiProperty({ description: 'Local da reunião', example: 'Sala 101 ou Zoom' })
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty({ description: 'Descrição da reunião', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Lembrete', enum: MeetingReminder, default: MeetingReminder.NOT })
    @IsEnum(MeetingReminder)
    reminder: MeetingReminder = MeetingReminder.NOT;
}
