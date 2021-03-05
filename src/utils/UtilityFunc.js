import { Alert } from 'react-native';
import moment from 'moment';

import Strings from '../themes/Strings'

// Validating inputs

export const IS_PLATFORM_ANDROID = Platform.OS === "android"
export const IS_PLATFORM_IOS = Platform.OS === "ios"

export const isValidEmail = (val) => {
    return !(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val));
}

export function validatePassword(val) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(val);
};


export const isValidContactNumber = (val) => {
    //var re=/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    var re = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    // return /^[0]?[6789]\d{9}$/.test(val);
    return !(re.test(val));
}

export const isValidPassword = (val) => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return !(re.test(val));
}


export const isEqual = (val1, val2) => {
    if (val1 != val2) {
        return false
    } else {
        return true
    }
}

export const isStrEmpty = (str) => {
    return str === ""
}

export const generateRandomKeyForFlatList = (str) => {
    const key = (Math.floor(Math.random() * Math.floor(new Date().getTime()))).toString()
    return key
}



//Alerts 

export function showAlertWithSingleAction(alertMessage, btnOnPress=()=>{}, btnText) {
    let text = btnText ?? Strings.Ok
    Alert.alert(
        Strings.AppName,
        alertMessage ?? "",
        [
            { text: text, onPress: () => btnOnPress() },
        ],
        { cancelable: false }
    )
}

export function showAlertWithDoubleAction(alertMessage, positiveBtnText, negativeBtnText, positiveBtnOnPress, negativeBtnOnPress) {
    let btnPositiveText = positiveBtnText ?? Strings.Ok
    let btnNegativeText = negativeBtnText ?? Strings.Ok
    Alert.alert(
        Strings.AppName,
        alertMessage,
        [
          { text: btnNegativeText, onPress: () => negativeBtnOnPress() },
          { text: btnPositiveText, onPress: () => positiveBtnOnPress() },
        ],
        { cancelable: false }
    )
}


// date relatded methods

export const isCurrentDate = (date) => {
    return moment(date).isSame(moment(), "date");
}

export const is30MinAfter = (date) => {
    let start = moment(date)
    let current = moment()
    let timeDuration = moment.duration(start.diff(current))
    let mins = timeDuration.asMinutes()
    if (mins > 30) {
        return true
    } else {
        return false
    }
}

export const is15MinAfter = (date) => {
    let start = moment(date)
    let current = moment()
    let timeDuration = moment.duration(start.diff(current))
    let mins = timeDuration.asMinutes()
    if (mins > 14) {
        return true
    } else {
        return false
    }
}

export const getDateBefor18Year = () => {
    const date = moment().subtract(18, 'years').toDate()
    return date
}

export const todayDate = () => {
    return new Date()
}

export const getDeviceTimezoneOffsetInSeconds = () => {
    const localTimeOffset = new Date().getTimezoneOffset() * -1
    return localTimeOffset*60
}

export const getDateString = (date,format) => {
    const customFormat = format ?? 'MMM, DD YYYY'
    return moment(date).format(customFormat)
}

export const getTimeString = (date,format) => {
    const customFormat = format ?? 'hh:mm A'
    return moment(date).format(customFormat)
}

export const getDateAfterDurationInMin = (min) => {
    return moment().add(5, 'minutes').toDate()
}

export const getDateWithFormate = (format) => {
    const customFormat = format ?? 'MMM, DD YYYY'
    return moment(date).format(customFormat)
}

export const parseDateFromServer = (strDate) => {// it parses from date string like "12-02-2001"
    const year = strDate.split("-")[2]
    const month = parseInt(strDate.split("-")[1]) - 1 // month starts from zero
    const day = strDate.split("-")[0]
    const date = new Date(year, month, day)
    return date
}
