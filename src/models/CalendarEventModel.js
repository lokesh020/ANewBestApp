class CalendarEventModel {


    startOnTime;
    endOnTime;
    timeDuration;
    activityScheduleDate;
    eventTitle;
    eventId;

    constructor(props) {
        if (props) {
            this.startOnTime = props.startOnTime ?? "";
            this.endOnTime = props.endOnTime ?? "";
            this.timeDuration = props.timeDuration ?? "";
            this.eventTitle = props.eventTitle ?? "";
            this.eventId = props.eventId ?? 0;
            this.activityScheduleDate = props.activityScheduleDate ?? "";
        }
    }


}


export default CalendarEventModel