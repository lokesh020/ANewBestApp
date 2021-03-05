import React, { useState, memo, useEffect, useCallback, forwardRef,useRef } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'

import Icon from 'react-native-vector-icons/Ionicons';

//models 
import { ActivityDetailModel } from '../../models/'

// Custom Utilities
import WebConstants from '../../utils/networkController/WebConstants';
import ApiManager from '../../utils/ApiManager'
import * as UtilityFunc from '../../utils/UtilityFunc'
import { Colors, Typography, Mixins } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';

// Custom Components
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import VideoPlayerModal from '../../components/VideoPlayerModal'
import AudioPlayerModal from '../../components/AudioPlayerModal'
import PdfReaderModal from '../../components/PdfReaderModal'


function ActivityDetailScreen({ navigation, route }) {

    const { activityId, subCategoryId } = route.params;

    const [activityDetailModel, setActivityDetailModel] = useState(new ActivityDetailModel({}));
    const [isActivityDataLoaded, setIsActivityDataLoaded] = useState(false)

    const [selectedMediaItem, setSelectedMediaItem] = useState(null)

    const videoPlayerModelRef = useRef(null)
    const audioPlayerModelRef = useRef(null)
    const pdfReaderModelRef = useRef(null)


    useEffect(() => {

        const activityDetailApiCall = () => {
            const body = {
                subCategoryId: subCategoryId,
                activityId: activityId
            }
            ApiManager.makePostRequest(true, WebConstants.kActivityDetail, body).then((response) => {
                let serverData = response.data
                let detailModel = new ActivityDetailModel(serverData)
                setActivityDetailModel(detailModel);
                setIsActivityDataLoaded(true);

            }).catch(() => {
            })
        }


        activityDetailApiCall();
    }, [])

    const onPlanThisActivityPress = useCallback(() => {
        navigateToScheduleActivityScreen(activityDetailModel.id,activityDetailModel.totalDuration)
    }, [activityDetailModel])

    const navigateToScheduleActivityScreen = (activityDetailId,totalDuration) => {
        navigation.navigate('ScheduleActivityScreen', { fromWhere: "ActivityDetailScreen", activityDetailId: activityDetailId, totalDuration: totalDuration})
    }

    const onBackPress = useCallback(() => {
        navigation.goBack();
    },[])

    const navigateToCalendar = useCallback(() => {
        navigation.navigate("CalendarAgenda", { fromWhere: "ActivityDetailScreen" })
    },[])

    const onMediaItemPress = (item) => {
        setSelectedMediaItem(item)
        if (item.mediaName.toLowerCase() == "video") {
            videoPlayerModelRef.current.show()
        }else if(item.mediaName.toLowerCase() == "audio"){
            audioPlayerModelRef.current.show()
        }else {
            pdfReaderModelRef.current.show()
        }
    }

    const onVideoModalCancel = () => {
        
    }

    const onAudioModalCancel = () => {
        
    }

    const onPdfReaderModalCancel = () => {
        
    }

    const DetailView = () => {

        if (activityDetailModel.title == "") {
            if (!isActivityDataLoaded) {
                return null
            } else {
                return <NoDataFound message={Strings.NoActivityDetailFound} />
            }
        }
        return (
            <KeyboardAwareScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <ActivityImage actionTypeId={activityDetailModel.actionTypeId} uri={activityDetailModel.thumbnail} />
                    <ActivityTitle title={activityDetailModel.title} />
                    <ActivityDuration value={activityDetailModel.totalDuration} />
                    <ActivityTimeSpend value={activityDetailModel.duration} />
                    <ActivityCreditPoints value={activityDetailModel.earnPoint} />
                    <MediaList data={activityDetailModel.media} onItemPress={onMediaItemPress} />
                    <ActivityDescription content={activityDetailModel.desc} />
                    <PlanThisActivityButton onPress={onPlanThisActivityPress} />
                </View>
            </KeyboardAwareScrollView>
        )
    }


    return (
        <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1 }} edges={['top']}>
            <Header title={Strings.Details} backAction={onBackPress} calendarAction={navigateToCalendar}/>
            <DetailView />
            <VideoPlayerModal ref={videoPlayerModelRef} url={selectedMediaItem && selectedMediaItem.fileUrl} onCancel={onVideoModalCancel} />
            <AudioPlayerModal ref={audioPlayerModelRef} url={selectedMediaItem && selectedMediaItem.fileUrl} onCancel={onAudioModalCancel} />
            <PdfReaderModal ref={pdfReaderModelRef} resource={{ uri : (selectedMediaItem && selectedMediaItem.fileUrl), cache:true}} onCancel={onPdfReaderModalCancel} />
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

const ActivityImage = memo(({ uri = "", actionTypeId }) => {
    if (actionTypeId == 2 || actionTypeId == 3) {
        return null
    }
    return (
        <View style={{ margin: 20, height: 200, marginBottom: 0, justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: uri }} style={styles.activityImg} />
        </View>
    )
})

const ActivityTitle = memo(({ title = "" }) => {
    return (
        <Text style={styles.activityTitle}>{title}</Text>
    )
})

const ActivityDuration = memo(({ value = 0 }) => {
    const timeUnit = (value > 1) ? "hours" : "hour"
    const totalDuration = value + " " +timeUnit
    return (
        <View style={[styles.activityDetailContainer, { marginTop: 20 }]}>
            <Text style={styles.activityDetailText}>{Strings.duration}</Text>
            <Text style={[styles.activityDetailText, { color: Colors.GREY }]}>{totalDuration}</Text>
        </View>
    )
})

const ActivityTimeSpend = memo(({ value = 0 }) => {
    const timeUnit = (value > 1) ? "mins" : "min"
    const totalTime = value + " " +timeUnit
    return (
        <View style={styles.activityDetailContainer}>
            <Text style={styles.activityDetailText}>{Strings.timeSpend}</Text>
            <Text style={[styles.activityDetailText, { color: Colors.GREY }]}>{totalTime}</Text>
        </View>
    )
})

const ActivityCreditPoints = memo(({ value = "" }) => {
    return (
        <View style={styles.activityDetailContainer}>
            <Text style={styles.activityDetailText}>{Strings.creditPoint}</Text>
            <Text style={[styles.activityDetailText, { color: Colors.GREY }]}>{value}</Text>
        </View>
    )
})

const ActivityDescription = memo(({ content = "" }) => {
    return (
        <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{Strings.description}</Text>
            <Text style={styles.descriptionText}>{content}</Text>
        </View>
    )
})

const PlanThisActivityButton = memo(({ onPress = () => { } }) => {

    return (
        <FilledButtonWithImg title={Strings.PlanThisActivity}
            textStyle={styles.planThisActivityButtonText}
            style={styles.planThisActivityButton}
            onPress={onPress}
        />
    )
})


const MediaList = ({ data = [], onItemPress = () => { } }) => {

    if (data.length == 0) {
        return null
    }

    return (
        <View style={{ display: 'flex', backgroundColor: 'red' }}>
            {data.map((element, index) => (<MediaItem key={index.toString()} item={element} index={index} onPress={() =>  onItemPress(element, index) } />))}
        </View>
    )

}

const MediaItem = ({ item, onPress }) => {
    let iconSrc = item.getMediaIconSrc()
    return (
        <Pressable style={styles.mediaContainer} onPress={onPress}>
            <Image source={iconSrc} style={styles.mediaImage} />
            <Text style={styles.mediaFileName}>{item.title}.{item.fileType}</Text>
        </Pressable>
    )
}

const NoDataFound = ({ message }) => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.noDataFoundText}>{message}</Text>
        </View>
    )
}


export default ActivityDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    activityImg: {
        resizeMode: 'cover',
        width: "100%",
        height: "100%",
        borderRadius: 10
    },
    activityName: {
        marginTop: Mixins.scaleRatio(2)
    },
    activityTitle: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_21,
        marginLeft: 20,
        marginTop: 20
    },
    activityDetailContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Mixins.scaleRatio(2),
        borderTopWidth: Mixins.scaleRatio(0.1),
        backgroundColor: Colors.WHITE,
        borderColor: Colors.BORDER_LINE
    },
    activityDetailText: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_16

    },
    mediaContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: Mixins.scaleRatio(2),
        backgroundColor: Colors.WHITE,
        borderTopWidth: Mixins.scaleRatio(0.1),
        borderColor: Colors.BORDER_LINE
    },
    mediaImage: {
        height: Mixins.scaleRatio(2.8),
        width: Mixins.scaleRatio(2.8),
        resizeMode: 'contain'
    },
    mediaFileName: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_17,
        paddingHorizontal: Mixins.scaleRatio(1.4)
    },
    descriptionContainer: {
        display: 'flex',
        padding: Mixins.scaleRatio(2)
    },
    description: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
    descriptionText: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_15,
        marginTop: Mixins.scaleRatio(1),
        color: "grey"
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
        height: 30,
    },
    noDataFoundText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_BOLD,
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },

    planThisActivityButton: {
        marginTop: 10,
        marginBottom: 40,
        height: 45,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10
    },
    planThisActivityButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16
    },

})