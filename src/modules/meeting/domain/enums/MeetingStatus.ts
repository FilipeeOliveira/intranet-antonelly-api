export enum MeetingStatus {
    SCHEDULED = 1,
    PRESENT = 2,
    COMPLETED = 3,
    CANCELED = 4
}

export const MeetingStatusList = {
    [MeetingStatus.SCHEDULED]: 'Agendado',
    [MeetingStatus.PRESENT]: 'Presente',
    [MeetingStatus.COMPLETED]: 'Concluída',
    [MeetingStatus.CANCELED]: 'Cancelada'
}