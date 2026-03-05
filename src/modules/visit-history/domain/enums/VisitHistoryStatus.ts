export enum VisitHistoryStatus {
  SCHEDULED = 1,
  PRESENT = 2,
  LEFT = 3,
}

export const VisitHistoryStatusList = {
  [VisitHistoryStatus.SCHEDULED]: "Agendado",
  [VisitHistoryStatus.PRESENT]: "Presente",
  [VisitHistoryStatus.LEFT]: "Saiu",
};
