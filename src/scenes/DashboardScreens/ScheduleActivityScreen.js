import React, { useState, memo, useEffect, useCallback, createRef, Fragment, useRef } from 'react'
import _ from 'lodash';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment'


// Custom Components
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import PickerDropDown from '../../components/PickerDropDown';
import WeekDaysPickerModel from '../../components/WeekDaysPickerModel';

// Custom Utilities
import WebConstants from '../../utils/networkController/WebConstants';
import ApiManager from '../../utils/ApiManager'
import { Colors, Typography, Mixins } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'


const activityDatePickerRef = createRef();
const activityTimePickerRef = createRef();

const perDayDurationData = [
    { label: "10 mins", value: 10 },
    { label: "15 mins", value: 15 },
    { label: "20 mins", value: 20 },
    { label: "25 mins", value: 25 },
    { label: "30 mins", value: 30 },
    { label: "35 mins", value: 35 },
    { label: "40 mins", value: 40 },
    { label: "45 mins", value: 45 },
    { label: "50 mins", value: 50 },
    { label: "55 mins", value: 55 },
    { label: "60 mins", value: 60 },
]

function ScheduleActivityScreen({ navigation, route }) {

    const { activityDetailId, totalDuration } = route.params;

    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date()
    })

    const [selectedTime, setSelectedTime] = useState(() => {
        const date = UtilityFunc.getDateAfterDurationInMin(5)// 5 Mins after
        return date
    })

    const [perDayDurationValue, setPerDayDurationValue] = useState(null)
    const [arrSelectedDays, setArrSelectedDays] = useState([]) // select availability data

    useEffect(() => {
        //life cycle like componentDidMount


    }, [])

    /**
     * Api calling
     */

    const scheduleApiCall = () => {
        const body = {
            activityDetailId: activityDetailId,
            startOnTime: moment(selectedTime).format("HH:mm"),
            endOnTime: moment(selectedTime).add(perDayDurationValue, "minutes").format("HH:mm"),
            startDate: moment(selectedDate).format("DD-MMM-YYYY"),
            perDayDuration: perDayDurationValue,
            totalDuration: totalDuration,
            earnPoint: 0,
            isReminderSet: false,
            activityStatus:1,
            availibility: (arrSelectedDays.length == 7) ? 1 : 3, // 1 for daily and 3 for monthly
            isMonday: arrSelectedDays.includes("Mon"),
            isTuesday: arrSelectedDays.includes("Tue"),
            isWendneday: arrSelectedDays.includes("Wed"),
            isThursday: arrSelectedDays.includes("Thu"),
            isFriday: arrSelectedDays.includes("Fri"),
            isSaturday: arrSelectedDays.includes("Sat"),
            isSunday: arrSelectedDays.includes("Sun"),
        }

        ApiManager.makePostRequest(true, WebConstants.kScheduleActivity, body).then((response) => {
            FlashManager.showSuccessMessage(response.successMsg, "", { duration: 2500 })
            navigation.navigate("DashboardScreen")
        }).catch((errStatus) => {

        })
    }

    const validateAllInputs = () => {
        if (UtilityFunc.isCurrentDate(selectedDate) && !UtilityFunc.is15MinAfter(selectedTime)) {
            UtilityFunc.showAlertWithSingleAction(Strings.SelectTimeAbove15MinValidation,()=>{})
            return false
        }else if(perDayDurationValue == null){
            UtilityFunc.showAlertWithSingleAction(Strings.SelectPerDayDurationValidation,()=>{})
            return false
        }else if(_.isEmpty(arrSelectedDays)){
            UtilityFunc.showAlertWithSingleAction(Strings.SelectAvailabilityValidation,()=>{})
            return false
        } else {
            return true
        }
    }

    const onBackPress = useCallback(() => {
        navigation.goBack();
    }, [])

    const navigateToCalendar = useCallback(() => {
        navigation.navigate("CalendarAgenda", { fromWhere: "ScheduleActivityScreen" })
    }, [])

    const onActivitySelectDatePress = useCallback(() => {
        activityDatePickerRef.current.show()
    }, [selectedDate])

    const onActivitySelectTimePress = useCallback(() => {
        activityTimePickerRef.current.show()
    }, [selectedTime])


    const onSavePress = () => {
        if (validateAllInputs()) {     
            scheduleApiCall()
        }
    }


    return (
        <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1 }} edges={['top']}>
            <Header title={Strings.Schedule} backAction={onBackPress} calendarAction={navigateToCalendar} />
            <View style={styles.container}>
                <ActivityDateSelect
                    value={selectedDate}
                    onPress={onActivitySelectDatePress}
                />
                <ActivityTimeSelect
                    value={selectedTime}
                    onPress={onActivitySelectTimePress}
                />
                <ActivityPerDayDuration
                    data={perDayDurationData}
                    value={perDayDurationValue}
                    onSelectValue={({ value }) => {
                        setPerDayDurationValue(value)
                    }}
                />
                <ActivityTotalDuration
                    value={totalDuration}
                />
                <SelectAvailability
                    arrSelectedDays={arrSelectedDays}
                    onValuesSelected={(arr) => {
                        setArrSelectedDays(arr)
                    }}
                />
                <View style={[styles.container, { justifyContent: 'flex-end', alignItems: "center" }]}>
                    <SaveButton onPress={onSavePress} />
                </View>
            </View>
            <DateTimePicker
                ref={activityDatePickerRef}
                initialDate={UtilityFunc.todayDate()}
                headerText={Strings.SelectDate}
                mode={"date"}
                minDate={UtilityFunc.todayDate()}
                onConfirm={(date) => {
                    setSelectedDate(date)
                }}
            />
            <DateTimePicker
                ref={activityTimePickerRef}
                initialDate={UtilityFunc.getDateAfterDurationInMin(5)}
                headerText={Strings.SelectTime}
                mode={"time"}
                onConfirm={(date) => {
                    setSelectedTime(date)
                }}
            />
        </SafeAreaView >
    )
}

const Header = ({ title = "", backAction = () => { }, notificationAction = () => { }, calendarAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <Pressable style={styles.headerBackBtn} onPress={backAction}>
                <Icon name={Images.back_icon_name} size={30} />
            </Pressable>
            <Text style={styles.headerText}>{title}</Text>
            <View style={styles.headerBtnCont}>
                <Pressable onPress={notificationAction}>
                    <Image source={Images.notification_icon} style={styles.headerIcon} />
                </Pressable>
                <Pressable onPress={calendarAction}>
                    <Image source={Images.calendar_icon} style={styles.headerIcon} />
                </Pressable>
            </View>
        </View>
    )
}

const ActivityDateSelect = memo(({ value, onPress = () => { } }) => {
    const [txtDate, setTxtDate] = useState("")
    useEffect(() => {
        if (value != null) {
            const dateStr = UtilityFunc.getDateString(value)
            setTxtDate(dateStr)
        }
    }, [value])
    return (
        <Pressable style={[styles.rowContainer, { marginTop: 20 }]} onPress={onPress}>
            <Text style={styles.scheduleText}>{Strings.SelectDate}</Text>
            <Text style={[styles.scheduleText, { color: Colors.GREY }]}>{txtDate}</Text>
        </Pressable>
    )
})

const ActivityTimeSelect = memo(({ value, onPress = () => { } }) => {
    const [txtTime, setTxtTime] = useState("")
    useEffect(() => {
        if (value != null) {
            const timeStr = UtilityFunc.getTimeString(value)
            setTxtTime(timeStr)
        }
    }, [value])
    return (
        <Pressable style={[styles.rowContainer]} onPress={onPress}>
            <Text style={styles.scheduleText}>{Strings.SelectTime}</Text>
            <Text style={[styles.scheduleText, { color: Colors.GREY }]}>{txtTime}</Text>
        </Pressable>
    )
})

const ActivityPerDayDuration = memo(({ data = [], value, onSelectValue = () => { } }) => {

    const pickerRef = useRef(null)
    const [pickerLabel, setPickerLabel] = useState("")

    useEffect(() => {
        if (value == null) {
            setPickerLabel(Strings.NotSelected)
        } else {
            const obj = data.find(element => element.value === value)
            setPickerLabel(obj.label)
        }
    }, [value])

    const onPickerPress = () => {
        pickerRef.current?.show()
    }

    return (
        <Fragment>
            <Pressable style={[styles.rowContainer]} onPress={onPickerPress}>
                <Text style={styles.scheduleText}>{Strings.PerDayDuration}</Text>
                <Text style={[styles.scheduleText, { color: Colors.GREY }]}>{pickerLabel}</Text>
            </Pressable>
            <PickerDropDown
                headerText={Strings.PerDayDuration}
                ref={pickerRef}
                data={data}
                onSelect={(item, index) => onSelectValue(item, index)}
            />
        </Fragment>

    )
})
const ActivityTotalDuration = memo(({ value = 0 }) => {
    const timeUnit = (value > 1) ? "hours" : "hour"
    const totalDuration = value + " " + timeUnit
    return (
        <Fragment>
            <Pressable style={[styles.rowContainer]}>
                <Text style={styles.scheduleText}>{Strings.TotalDuration}</Text>
                <Text style={[styles.scheduleText, { color: Colors.GREY }]}>{totalDuration}</Text>
            </Pressable>
        </Fragment>

    )
})
const SelectAvailability = memo(({ arrSelectedDays = [], onValuesSelected = () => { } }) => {

    const pickerRef = useRef(null)
    const [pickerLabel, setPickerLabel] = useState("")

    useEffect(() => {
        if (_.isEmpty(arrSelectedDays)) {
            setPickerLabel(Strings.NotSelected)
        } else {
            //all days selected in week picker
            if (arrSelectedDays.length == 7) {
                setPickerLabel(Strings.Daily)
            } else {
                setPickerLabel(Strings.Weekly)
            }
        }
    }, [arrSelectedDays])

    const onPickerPress = () => {
        pickerRef.current?.show()
    }

    return (
        <Fragment>
            <Pressable style={[styles.rowContainer]} onPress={onPickerPress}>
                <Text style={styles.scheduleText}>{Strings.SelectAvailability}</Text>
                <Text style={[styles.scheduleText, { color: Colors.GREY }]}>{pickerLabel}</Text>
            </Pressable>
            <WeekDaysPickerModel
                ref={pickerRef}
                onSubmit={(arrDays) => onValuesSelected(arrDays)}
            />
        </Fragment>

    )
})

const SaveButton = ({ onPress = () => { } }) => {
    return (
        <FilledButtonWithImg
            title={Strings.Save.toLocaleUpperCase()}
            textStyle={styles.saveButtonText}
            style={styles.saveButton}
            onPress={onPress}
        />
    )
}


export default ScheduleActivityScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 0.7,
        backgroundColor: Colors.WHITE,
        borderColor: Colors.BORDER_LINE
    },
    scheduleText: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_16

    },
    saveButton: {
        height: 50,
        width: "90%",
        marginBottom: 50
    },
    saveButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_18
    },
    headerCont: {
        width: "100%",
        justifyContent: "space-between",
        height: 45,
        paddingLeft: 8,
        paddingRight: 15,
        paddingTop: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    headerBtnCont: {
        width: 70,
        justifyContent: "space-between",
        flexDirection: "row",
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
        width: 30,
        height: 30
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },

})