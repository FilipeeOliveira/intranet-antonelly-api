import moment from "moment";

export function getCurrentUtcDate() {
  return moment().utc(true).toDate();
}
