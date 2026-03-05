export enum MeetingStatus {
  SCHEDULED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export const MeetingStatusList = {
  [MeetingStatus.SCHEDULED]: "Agendado",
  [MeetingStatus.IN_PROGRESS]: "Em andamento",
  [MeetingStatus.COMPLETED]: "Concluída",
  [MeetingStatus.CANCELED]: "Cancelada",
};
