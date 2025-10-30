import moment from "moment";

export function getLocalDateToUtcDate(date: Date) {
    return moment(date).utc(true).toDate();
    
}