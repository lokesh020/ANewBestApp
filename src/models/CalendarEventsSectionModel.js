import CalendarEventModel from './CalendarEventModel'
import _ from 'lodash'

class CalendarEventsSectionModel {


    title;
    data;

    constructor(props) {
        if (props) {
            this.title = props.title ?? "";
            this.data = this.getEventModelArr(props.data)
        }
    }

    getEventModelArr = (data) => {
        let arrMapped = data.map((element)=>{
            if(_.isEmpty(element)){
                return {}
            }
            return new CalendarEventModel(element)
        })
        return arrMapped
    }
    

}


export default CalendarEventsSectionModel