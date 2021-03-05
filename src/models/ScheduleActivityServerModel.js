import * as UtilityFunc from '../utils/UtilityFunc'
import moment from 'moment'

class ScheduleActivityServerModel {

    startDate;
    endDate;
    activityScheduleDate;
    startOn;
    endsOn;
    id;
    idd;
    activityDetailId;
    userId;
    perDayDuration;
    totalDuration;
    day;
    title;
    constructor(props) {
        if (props) {
            this.startDate = this.getFormattedDate(props.startDate) ?? "";
            this.endDate = props.endDate ?? "";
            this.activityScheduleDate = this.getFormattedDate(props.activityScheduleDate) ?? "";
            this.startOn = props.startOn ?? "";
            this.endsOn = props.endsOn ?? "";
            this.id = props.id ?? 0;
            this.idd = props.idd ?? 0;
            this.activityDetailId = props.activityDetailId ?? 0;
            this.userId = props.userId ?? 0;
            this.perDayDuration = props.perDayDuration ?? 0;
            this.totalDuration = props.totalDuration ?? 0;
            this.day = props.day ?? "";
            this.title = props.title ?? "";
        }
    }

    getFormattedDate = (date) => {    
        const str = moment(UtilityFunc.parseDateFromServer(date)).format("YYYY-MM-DD")
        return str
    }

}


export default ScheduleActivityServerModel