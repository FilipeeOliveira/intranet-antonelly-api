import moment from "moment";
import { MeetingStatus } from "../../domain/enums/MeetingStatus";

/**
 * Adiciona flags de ação (`canStart`, `canFinish`, `canEdit`, `canCancel`) a cada reunião,
 * evitando que o front precise replicar regras de negócio para exibir/ocultar botões.
 *
 * Regras:
 *  canStart  → SCHEDULED + hoje + dentro da janela (>= startTime && < endTime)
 *  canFinish → IN_PROGRESS
 *  canEdit   → SCHEDULED
 *  canCancel → SCHEDULED
 */
export class MeetingPresenter {
  static present(meeting: any): any {
    const now = moment().utc(true);
    const currentTime = now.format("HH:mm");
    const meetingDate = moment.utc(meeting.date);
    const isToday = now.isSame(meetingDate, "day");

    const canStart =
      meeting.status === MeetingStatus.SCHEDULED &&
      isToday &&
      currentTime >= meeting.startTime &&
      currentTime < meeting.endTime;

    const canFinish = meeting.status === MeetingStatus.IN_PROGRESS;
    const canEdit = meeting.status === MeetingStatus.SCHEDULED;
    const canCancel = meeting.status === MeetingStatus.SCHEDULED;

    return {
      ...meeting,
      canStart,
      canFinish,
      canEdit,
      canCancel,
    };
  }

  static presentMany(meetings: any[]): any[] {
    return meetings.map((m) => MeetingPresenter.present(m));
  }

  static presentPaginated(result: {
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) {
    return {
      ...result,
      data: MeetingPresenter.presentMany(result.data),
    };
  }
}
