import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MeetingStatus } from '../../infrastructure/repositories/meeting.repository';

export class CreateMeetingDto {
    @ApiProperty({ description: 'Assunto da reunião', example: 'Revisão do Sprint' })
    @IsNotEmpty()
    @IsString()
    subject: string;

    @ApiProperty({ description: 'Descrição da reunião', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Data da reunião (YYYY-MM-DD)', example: '2025-10-01', required: true })
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @ApiProperty({ description: 'Horário da reunião (HH:MM)', example: '14:30', required: true })
    @IsNotEmpty()
    @IsString()
    startTime: string;

    @ApiProperty({ description: 'Fim da reunião (HH:MM)', example: '15:30', required: true })
    @IsNotEmpty()
    @IsString()
    endTime: string;

    @ApiProperty({ description: 'ID Sala da reunião', example: 'uuid-da-sala', required: true })
    @IsNotEmpty()
    @IsString()
    roomId: string;

    @ApiProperty({ description: 'ID do Setor da reunião', example: 'uuid-do-setor', required: true })
    @IsNotEmpty()
    @IsString()
    sectorId: string;

    @ApiProperty({ description: 'Status da reunião', example: MeetingStatus.SCHEDULED, enum: MeetingStatus, required: false })
    @IsEnum(MeetingStatus)
    @IsOptional()
    status?: MeetingStatus;
}
