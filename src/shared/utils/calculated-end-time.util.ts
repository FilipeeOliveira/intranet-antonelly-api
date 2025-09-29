import { MeetingDuration } from "src/modules/meeting/domain/dto/create-meeting.dto";


function calculateEndTime(start: string, duration: MeetingDuration): string {
    const [hours, minutes] = start.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;

    switch (duration) {
        case MeetingDuration.MIN_15: totalMinutes += 15; break;
        case MeetingDuration.MIN_30: totalMinutes += 30; break;
        case MeetingDuration.MIN_45: totalMinutes += 45; break;
        case MeetingDuration.H_1: totalMinutes += 60; break;
        case MeetingDuration.H_1_30: totalMinutes += 90; break;
        case MeetingDuration.H_2: totalMinutes += 120; break;
        case MeetingDuration.H_3: totalMinutes += 180; break;
    }

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

export { calculateEndTime };