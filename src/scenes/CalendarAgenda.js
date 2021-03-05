import _ from 'lodash';
import moment from 'moment';
import XDate from 'xdate';
import React, { Fragment, Component, memo } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


//custom components
import { ExpandableCalendar, CalendarProvider, AgendaList } from '../components/Calendar/';

//custom utilities
import WebConstants from '../utils/networkController/WebConstants';
import ApiManager from '../utils/ApiManager'
import { Colors, Typography } from '../styles/'
import Images from '../assets/images/'

//models
import { ScheduleActivityServerModel, CalendarEventsSectionModel } from '../models/';



class CalendarAgenda extends Component {


  constructor(props) {
    super(props)
    this.state = {
      firstSelectedDate: "",
      calendarEvents: [],
    }
    this.selectedStartMonthDate = new Date()
  }


  componentDidMount() {
    const startDate = this.getStartOfMonthDate(new Date())
    this.getMonthlyScheduleActivityListApiCall(startDate)
  }

  onBackPress = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  /**
   * UI rendering
   */

  render() {

    const { firstSelectedDate, calendarEvents, markedDates } = this.state

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_ACTIVITY_SCREEN }}>
        <Header
          title={"Calendar"}
          backAction={this.onBackPress}
        />
        <CalendarProvider
          date={firstSelectedDate}
          onDateChanged={this.onDateChanged}
          onMonthChange={this.onMonthChange}
          showTodayButton={false}
          disabledOpacity={0.6}
          ref = {(ref)=>this.calendarProvier = ref}
        >
          <ExpandableCalendar
            style={styles.calendar}
            ref={ref => (this._calendarList = ref)}
            pastScrollRange={12}
            futureScrollRange={12}
            hideArrows={false}
            hideExtraDays={true}
            scrollEnabled={false}
            displayLoadingIndicator={false}
            disableAllTouchEventsForDisabledDays
            firstDay={1}
            disablePan={true}
            disableWeekScroll={true}
            markedDates={this.getMarkedDates()}
            renderArrow={this.renderArrow}
            hideKnob={false}
          />
          <AgendaList
            ref = {(ref)=>this.agendaList = ref}
            sections={calendarEvents}
            extraData={this.state}
            renderItem={this.renderItem}
            sectionStyle={styles.sectionText}
          />
        </CalendarProvider>
      </SafeAreaView>
    )
  }


  renderArrow = (direction) => {
    const isLeft = direction === "left"
    if (isLeft) {
      return <CalendarArrow iconName={"angle-double-left"} size={25} />
    } else {
      return <CalendarArrow iconName={"angle-double-right"} size={25} />
    }
  }

  renderEmptyItem() {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned</Text>
      </View>
    );
  }

  renderItem = ({ item }) => {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem();
    }
    return (
      <Pressable style={styles.item}>
        <View>
          <Text style={styles.itemHourText}>{item.startOnTime}</Text>
          <Text style={styles.itemDurationText}>{item.timeDuration+" mins"}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.eventTitle}</Text>
        <View style={styles.itemButtonContainer}>
        </View>
      </Pressable>
    );
  };


  /**
   * business logic and events
   */

  onDayChanged = (dateBundle) => {
  };

  onMonthChange = (dateBundle) => {
    const date = new Date(dateBundle.dateString)
    this.getMonthlyScheduleActivityListApiCall(date)
  };


  getMarkedDates = () => {
    const { calendarEvents } = this.state
    const marked = {};
    calendarEvents.forEach(item => {
      // NOTE: only mark dates with data
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        marked[item.title] = { marked: true };
      } else {
        marked[item.title] = { marked: false };
      }
    });
    return { ...marked }
  };

  getScheduleActivityModelArr = (arrServerData = []) => {
    const arrMapped = arrServerData.map((element) => (new ScheduleActivityServerModel(element)))
    return arrMapped
  }

  getCalendarEventSectionModelArr = (arr) => {
    const arrSectionsObj = this.getGroupedCalendarSectionData(arr, function (element) {
      return element.activityScheduleDate
    });
    // sort the array by dates 
    const arrSortedArray = this.getSortedEventsArrayByDate(arrSectionsObj)
    let arrMonthDates = Array.from({length: moment(this.selectedStartMonthDate).daysInMonth()}, (x, i) => moment(this.selectedStartMonthDate).startOf('month').add(i, 'days').format('YYYY-MM-DD'))
    
    /**
     * creates monthly data for all days in month if a date has a event or not
     */

    const arrSectionsModel = []
    arrMonthDates.forEach((element, index) => {
        const obj =  arrSortedArray.find(objSection => objSection.title === element)
        if (_.isEmpty(obj)) {
          const model = new CalendarEventsSectionModel({title : element, data : [{}]})
          arrSectionsModel.push(model)
        }else{
          const model = new CalendarEventsSectionModel(obj)
          arrSectionsModel.push(model)
        }
      });
    return arrSectionsModel
  }

  getGroupedCalendarSectionData = (arr, keyGetter) => {
    var groups = {};
    arr.forEach(function (el) {
      var key = keyGetter(el);
      if (key in groups == false) {
        groups[key] = [];
      }
      groups[key].push(el);
    });
    return Object.keys(groups).map((key) => {
      let eventData = groups[key].map((element) => {
        return {
          eventId: element.id,
          eventTitle: element.title,
          startOnTime: element.startOn,
          endOnTime: element.endsOn,
          activityScheduleDate: element.activityScheduleDate,
          timeDuration: this.getTimeDurationInMins(element.activityScheduleDate, element.startOn, element.endsOn)
        }
      }) // map scheduleActivity data from server to like [{startOnTime:"",endOnTime,"",timeDuration:"",title:""}]
      const obj = { title: key, data: eventData }
      // const model = new CalendarEventsSectionModel(obj)
      return obj;
    });
  };

  getTimeDurationInMins = (datestr, startTime, endTime) => {
    const formattedDateStr = moment(new Date(datestr)).format("DD-MMM-YYYY")
    let start = moment(Date.parse(formattedDateStr+" "+startTime))
    let end = moment(Date.parse(formattedDateStr + " " + endTime))
    let timeDuration = moment.duration(end.diff(start))
    let str = timeDuration.asMinutes()
    return str
  }

  getSortedEventsArrayByDate = (arr) => {
    return arr.sort(function (a, b) {
      var c = new Date(a.title);
      var d = new Date(b.title);
      return c - d;
    });
  }

  getStartOfMonthDate = (date, format = "DD-MMM-YYYY") => {
    return moment(new Date(date.getFullYear(), date.getMonth(), 1)).format(format)
  }

  scrollToCurrentDate = () => {
    const {firstSelectedDate} = this.state
    const calendarMonth = moment(firstSelectedDate).format("MM")
    const currentMonth = moment().format("MM") 
    if (calendarMonth == currentMonth) {
      console.log("calendarMonth",calendarMonth,currentMonth)
      setTimeout(() => {
        const todayDateStr = moment().format("YYYY-MM-DD")
        this.agendaList.contentRef.scrollToDate(todayDateStr)
      }, 1000);
    }
  }

  /**
   * Api calling
   */

  getMonthlyScheduleActivityListApiCall = (date) => {
    this.selectedStartMonthDate = moment(date).startOf("month").format("DD-MMM-YYYY")
    const body = {
      "startDate": moment(date).format("DD-MMM-YYYY")
    }
    ApiManager.makePostRequest(true, WebConstants.kGetCalenderScheduleActivityList, body).then((response) => {
      if (_.isEmpty(response.data)) {
        // No data avaiable for events
        this.setState({ calendarEvents: []})
      }else{
        const arrScheduleActivities = this.getScheduleActivityModelArr(response.data)
        const arrSectionWiseEvents = this.getCalendarEventSectionModelArr(arrScheduleActivities) ?? []
        this.setState({ calendarEvents: arrSectionWiseEvents, firstSelectedDate: arrSectionWiseEvents[0].title },()=>{
          this.scrollToCurrentDate()
        })
      }
    }).catch((errStatus) => {

    })
  }

}

const Header = ({ title = "", backAction = () => { }, notificationAction = () => { }, todayCalendarAction = () => { } }) => {
  return (
    <View style={styles.headerCont}>
      <Pressable style={styles.headerBackBtn} onPress={backAction}>
        <Icon name={Images.back_icon_name} size={25} />
      </Pressable>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.headerBtnCont}>
        {/* <Pressable onPress={todayCalendarAction} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                    <Image source={Images.today_calendar_icon} style={styles.headerIcon} />
                </Pressable> */}
      </View>
    </View>
  )
}

const CalendarArrow = memo(({ iconName, style, size }) => {
  return (
    <FontAwesome name={iconName} style={style} size={size} />
  )
})



export default CalendarAgenda;

const styles = StyleSheet.create({
  calendar: {
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16
  },
  headerCont: {
    width: "100%",
    justifyContent: "space-between",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomColor: Colors.BORDER_LINE,
    borderBottomWidth: 1
  },
  headerBtnCont: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_18,
    textAlign: "center",
    left: 5
  },
  headerIcon: {
    resizeMode: "contain",
    width: 20,
    height: 20
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  sectionText: {
    fontFamily:Typography.FONT_FAMILY_MEDIUM,
    fontSize:Typography.FONT_SIZE_13,
    lineHeight: 16,
    color: '#7a92a5',
    paddingTop: 24, // 8
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'left',
    textTransform: 'uppercase'
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginTop: 10,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 40,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});