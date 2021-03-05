import React, { useState, useCallback, memo, useEffect, useRef, createRef } from 'react'
import { View, Text, StyleSheet, Pressable, Image, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

import VideoPlayer from '../../components/RNVideoPlayer/'
import AudioPlayer from '../../components/RNAudioPlayer/'
import RNPdf from '../../components/RNPdf'
import {useBackHandler} from '../../customHooks/'

//import ScrollView from '../../components/RNVideoPlayer/components/ScrollView'

//models 


// Custom Utilities
import WebConstants from '../../utils/networkController/WebConstants';
import ApiManager from '../../utils/ApiManager'
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'
import { Colors, Typography, Mixins } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';
import { isIphoneX } from '../../utils/IphoneXHelper'

// Custom Components

import CountTimer from '../../components/CountTimer'

import ErrorBoundaryComp from '../../components/ErrorBoundaryComp'
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";


const countTimerRef = createRef(null)

function TimerScreen({ navigation, route }) {

    const { activityId, subCategoryId, mediaType, mediaUrl, activityLogId, completedTime, fromWhere, fromWhichTabSelection, duration } = route.params;

    /**
     * Timer pause state = false
     * Timer play state  = true
     */
    const [isTimerPlayState, setIsTimerPlayState] = useState(false)//default pause state


    //like ComponentDidMount
    useEffect(() => {

        //like component will unmount
        return () => {

        }
    }, [])

    const backButtonAction = useCallback(() => {
        pauseActivityWithBackButtonHandler()
    }, [])

    /**
     * android back handler
     */
    useBackHandler(() => {
        pauseActivityWithBackButtonHandler()
        return true
    })


   const pauseActivityWithBackButtonHandler = () => {
       if (isTimerPlayState) {
           UtilityFunc.showAlertWithDoubleAction(Strings.DoYouWantPauseActivity, Strings.Ok, Strings.Cancel, () => {
               //positive btn action
               let timerDuration = countTimerRef.current.getCurrentTimerDuration()
               countTimerRef.current.pauseTimer()
               pauseActivityApiCall(timerDuration, () => {
                   navigation.navigate("MyActivityScreen")
               })
           }, () => {
               //negative btn action
   
           })
       }else{
            navigation.navigate("MyActivityScreen")
       }
    }

    const onTimerPlayPauseStateChange = (timerState) => {
        setIsTimerPlayState(timerState)
        if (timerState == true) {
            countTimerRef.current.startTimer()
        } else {
            let timerDuration = countTimerRef.current.getCurrentTimerDuration()
            pauseActivityApiCall(timerDuration)
            countTimerRef.current.pauseTimer()
        }
    }

    const onFinishActivityButtonPress = () => {
        let timerDuration = countTimerRef.current.getCurrentTimerDuration()
        if (timerDuration < 60) {
            UtilityFunc.showAlertWithSingleAction(Strings.PerformActivityForAtLeastOneMinBeforeFinish)
        }else{
            onFinishActivityPerform()
        }
    }

    const onSubmitActivityButtonPress = () => {

    }

    const onFinishActivityPerform = () => {
        let timerDuration = countTimerRef.current.getCurrentTimerDuration()
        countTimerRef.current.pauseTimer()
        finishActivityForTodayApiCall(timerDuration,()=>{
            
        })
    }


    /**
     * Api calling
     */
    const pauseActivityApiCall = (duration = 0, resCallBack = () => { }) => {
        const body = {
            activityId: activityId,
            subCategoryId: subCategoryId,
            activityStatus: 0,
            completedTime: duration,
            isFinishedToday: false,
            activityLogId: activityLogId,
        }
        ApiManager.makePostRequest(true, WebConstants.kPauseActivity, body).then((response) => {
            UtilityFunc.showAlertWithSingleAction(response.successMsg, () => {
                resCallBack()
            })
        }).catch((errStatus) => {

        })
    }

    const finishActivityForTodayApiCall = (duration = 0,resCallBack = () => { }) => {
        const body = {
            activityId: activityId,
            subCategoryId: subCategoryId,
            activityStatus: 0,
            completedTime: duration,
            isFinishedToday: true,
            activityLogId: activityLogId,
        }
        ApiManager.makePostRequest(true, WebConstants.kPauseActivity, body).then((response) => {
            UtilityFunc.showAlertWithSingleAction(response.successMsg, () => { 
                resCallBack()
            })
        }).catch((errStatus) => {

        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <Header title="Timer" backAction={backButtonAction} />
            <View style={styles.timerCountRow}>
                <CountTimer
                    ref={countTimerRef}
                    startFromInSeconds={completedTime}
                    maxCountDuration={7200} //max hours = 2 hrs
                    minCountDuration={duration * 60} // per day duration
                    onMinCounterDurationReached={(value) => { console.log(">>>>>>min counter duration", value) }}
                    onMaxCounterValueReached={(value) => { console.log(">>>>>>max counter duration", value) }}
                />
                <TimerPlayPauseButton isTimerPlayState={isTimerPlayState} onTimerStateChange={onTimerPlayPauseStateChange} />
            </View>
            <MediaContentContainer mediaUrl={mediaUrl} mediaType={mediaType} />
            <View style={styles.bottomButtonsRow}>
                <FinishActivityButton onPress={onFinishActivityButtonPress} />
                <SubmitActivityButton onPress={onSubmitActivityButtonPress} />
            </View>
        </SafeAreaView>
    )
}

const MediaContentContainer = memo(({ mediaUrl = "", mediaType = "" }) => {
    if (mediaType == "video") {
        return (
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: Colors.BG_ACTIVITY_SCREEN }}>
                <VideoPlayer
                    url={mediaUrl}
                    videoProps={{
                        poster: Image.resolveAssetSource(Images.img_wellness_activity_logo).uri
                    }}
                    hideFullScreenControl={true}
                    inlineOnly={true}
                    lockRatio={16 / 9}
                />
            </View>
        )
    } else if (mediaType == "audio") {
        return (
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: Colors.BG_ACTIVITY_SCREEN }}>
                <AudioPlayer
                    url={mediaUrl}
                    audioProps={{
                        poster: Image.resolveAssetSource(Images.img_wellness_activity_logo).uri
                    }}
                />
            </View>
        )
    } else if (mediaType == "pdf") {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.BG_ACTIVITY_SCREEN }}>
                <RNPdf
                    resource={{ uri: mediaUrl, cache: true }}
                />
            </View>
        )
    } else {
        return null
    }
})


const Header = memo(({ title = "", backAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <Pressable style={styles.headerBackBtn} onPress={backAction}>
                <Icon name={Images.back_icon_name} size={30} />
            </Pressable>
            <Text style={styles.headerText}>{title}</Text>
            <View style={styles.headerBtnCont}>
                {/* <Pressable onPress={notificationAction}>
                    <Image source={Images.notification_icon} style={styles.headerIcon} />
                </Pressable>
                <Pressable onPress={calendarAction}>
                    <Image source={Images.calendar_icon} style={styles.headerIcon} />
                </Pressable> */}
            </View>
        </View>
    )
})

const TimerPlayPauseButton = memo(({ isTimerPlayState = false, onTimerStateChange = () => { } }) => {
    const handleTimerStateChange = () => {
        const changedState = !isTimerPlayState
        onTimerStateChange(changedState)
    }
    return (
        <Pressable style={{ width: 40, height: 35 }} onPress={handleTimerStateChange}>
            <Image source={isTimerPlayState ? Images.play_timer_icon : Images.pause_timer_icon} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
        </Pressable>
    )
})

/**
 * Finishes activities on daily basis
 */
const FinishActivityButton = ({ onPress = () => { } }) => {
    return (
        <FilledButtonWithImg title={Strings.Finish} textStyle={styles.finishButtonText} style={styles.finishButton} onPress={onPress} />
    )
}

/**
 * submit activities
 */
const SubmitActivityButton = ({ onPress = () => { } }) => {
    return (
        <FilledButtonWithImg title={Strings.Submit} textStyle={styles.submitButtonText} style={styles.submitButton} onPress={onPress} />
    )
}


export default TimerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
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
        backgroundColor: Colors.WHITE
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
        height: 30,
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },
    timerCountRow: {
        height: 70,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 8,
        alignItems: "flex-end",
        backgroundColor: Colors.WHITE
    },
    bottomButtonsRow: {
        height: 90,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: Colors.WHITE
    },
    finishButton: {
        height: 50,
        width: "45%",
    },
    finishButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
    submitButton: {
        height: 50,
        width: "45%",
    },
    submitButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
})