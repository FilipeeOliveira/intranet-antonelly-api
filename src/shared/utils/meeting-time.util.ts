import moment from "moment";

/**
 * Converte date (Date) + timeStr (HH:MM) em um DateTime real (UTC).
 * Usa utc(true) para tratar a data como UTC, consistente com o restante do sistema.
 */
export function buildDateTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return moment(date).utc(true).startOf("day").add(hours, "hours").add(minutes, "minutes").toDate();
}

/**
 * Retorna o horário atual em formato HH:MM (UTC).
 */
export function currentTimeUTC(): string {
  return moment().utc(true).format("HH:mm");
}
