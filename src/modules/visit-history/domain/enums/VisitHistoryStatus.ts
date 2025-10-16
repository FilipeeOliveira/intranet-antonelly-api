export enum VisitHistoryStatus {
    WAITING = 1,
    PRESENT = 2,
    FINISHED = 3,
    CANCELED = 4
}

export const VisitHistoryStatusList = {
    [VisitHistoryStatus.WAITING]: 'Aguardando',
    [VisitHistoryStatus.PRESENT]: 'Presente',
    [VisitHistoryStatus.FINISHED]: 'Finalizada',
    [VisitHistoryStatus.CANCELED]: 'Cancelada'
}