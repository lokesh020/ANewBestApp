import React, { useState, memo, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'
import Icon from 'react-native-vector-icons/Ionicons';
//models 
import { ActivityDetailModel } from '../../models'

// Custom Utilities
import WebConstants from '../../utils/networkController/WebConstants';
import ApiManager from '../../utils/ApiManager'
import { Colors, Typography } from '../../styles'
import Images from '../../assets/images'
import Strings from '../../themes/Strings';

// Custom Components
import { scaleRatio } from '../../styles/mixins';



function DrawingDetailScreen({ navigation, route }) {

    const { activityId, subCategoryId } = route.params;

    const [activityDetailModel, setActivityDetailModel] = useState(new ActivityDetailModel({}));
    const [isActivityDataLoaded, setIsActivityDataLoaded] = useState(false)


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



    const onBackPress = () => {
        navigation.goBack();
    }


    const renderDetailView = () => {

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
                    <ActivityImage uri={activityDetailModel.thumbnail} />
                    <ActivityTitle title={activityDetailModel.title} />
                    <ActivityDescription content={activityDetailModel.desc} />
                </View>
            </KeyboardAwareScrollView>
        )
    }


    return (
        <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1 }} edges={['top']}>
            <Header title={Strings.Details} backAction={onBackPress} />
            {renderDetailView()}
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

const ActivityImage = memo(({ uri = "" }) => {
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

const ActivityDescription = memo(({ content = "" }) => {
    return (
        <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{Strings.description}</Text>
            <Text style={styles.descriptionText}>{content}</Text>
        </View>
    )
})



const MediaItem = ({ item, onPress }) => {
    let iconSrc = item.getMediaIconSrc()
    return (
        <Pressable style={styles.mediaContainer} onPress={onPress}>
            <Image source={iconSrc} style={styles.mediaImage} />
            <Text style={styles.mediaFileName}>{item.fileName}.{item.fileType}</Text>
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


export default DrawingDetailScreen

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
        marginTop: scaleRatio(2)
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
        padding: scaleRatio(2),
        borderTopWidth: scaleRatio(0.1),
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
        padding: scaleRatio(2),
        backgroundColor: Colors.WHITE,
        borderTopWidth: scaleRatio(0.1),
        borderColor: Colors.BORDER_LINE
    },
    mediaImage: {
        height: scaleRatio(2.8),
        width: scaleRatio(2.8),
        resizeMode: 'contain'
    },
    mediaFileName: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_17,
        paddingHorizontal: scaleRatio(1.4)
    },
    descriptionContainer: {
        display: 'flex',
        padding: scaleRatio(2)
    },
    description: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17
    },
    descriptionText: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_15,
        marginTop: scaleRatio(1),
        color: "grey"
    },
    headerCont: {
        width: "100%",
        justifyContent: "space-between",
        height: 45,
        paddingHorizontal: 15,
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

})