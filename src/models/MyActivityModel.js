import ActivityModel from './ActivityModel';

class MyActivityModel extends ActivityModel {

    activityLogId ;
    completedTime;
    isFinishedToday;

    constructor(props) {
        super(props)
        if (props) {
            this.activityLogId = props.activityLogId ?? 0
            this.completedTime = props.completedTime ?? 0
            this.isFinishedToday = props.isFinishedToday ?? false
        }
    }

}

export default MyActivityModel;