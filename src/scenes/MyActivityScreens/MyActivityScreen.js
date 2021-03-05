import React, { useState, useCallback, memo, useEffect, useRef } from 'react'
import { useDidUpdate } from '../../customHooks/'
import { View, Text, StyleSheet, Pressable, Image, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import _ from 'lodash';

//models 
import { MyActivityModel } from '../../models/'

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

import ErrorBoundaryComp from '../../components/ErrorBoundaryComp'
import MyActivitySegmentControlTab from '../../components/MyActivitySegmentControlTab'


let activityListReqBody = {}

function MyActivityScreen({ navigation }) {

    const [hasComponentError, setHasComponentError] = useState(false)
    const [componentErrStatus, setComponentErrStatus] = useState(null)
    /**
     * selectedTabIndex = 0 (Planned)
     * selectedTabIndex = 1 (InProgress)
     * selectedTabIndex = 2 (Completed)
     */
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const [activityListData, setActivityListData] = useState([])
    const [isActivityListDataLoaded, setIsActivityListDataLoaded] = useState(false)
    const [isLoadMoreActivityList, setIsLoadMoreActivityList] = useState(false)

    const pageNumberRef = useRef(2) // for next page activity list

    useEffect(() => {
        //for initial api calling
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            //api calling
            if (hasComponentError == false) {
                if (selectedTabIndex!==0) {
                    setSelectedTabIndex(0)   
                }else{
                    getActivityListByTypeApiCall()
                }
            }
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [selectedTabIndex,hasComponentError]);

    /**
     * Whenever tab index changes activity list api call
     */

    useDidUpdate(() => {
        //api calling
        getActivityListByTypeApiCall()
    }, [selectedTabIndex])

    const getActivityListByTypeApiCall = (pageNumber = 1) => {

        pageNumberRef.current = 2 // whenever calls pagenumber set to initial
        const body = {
            "categoryId": 0,
            "subCategoryId": 0,
            "duration": 0,
            "status": getSelectedTabName().toUpperCase(),
            "offset":UtilityFunc.getDeviceTimezoneOffsetInSeconds(),
            "pageNumber": pageNumber,
            "pageSize": 10
        }
        activityListReqBody = { ...body }
        ApiManager.makePostRequest(true, WebConstants.kGetActivityListByType, body).then((response) => {
            const arrData = response.data.map((element, i) => {
                const model = new MyActivityModel(element)
                return model
            })
            setActivityListData(arrData)
            setIsActivityListDataLoaded(true)
        }).catch((errStatus) => {
            setHasComponentError(true)
            setComponentErrStatus(errStatus)
        })
    }

    const getLoadMoreActivityListApiCall = (pageNumber) => {
        const body = { ...activityListReqBody, pageNumber }
        setIsLoadMoreActivityList(true)
        ApiManager.makePostRequest(false, WebConstants.kGetActivityListByType, body).then((response) => {
            setIsLoadMoreActivityList(false)
            const arrData = response.data.map((element, i) => {
                const model = new MyActivityModel(element)
                return model
            })
            if (arrData.length == 0) {
            } else {
                pageNumberRef.current = pageNumberRef.current + 1
                setActivityListData([...activityListData, ...arrData])
            }
        }).catch((errStatus) => {
            setHasComponentError(true)
            setComponentErrStatus(errStatus)
        })
    }

    const onActivityItemPressed = (item, index) => {
        /**
         * Checks if an activity has been finished for today by user and now user can't perform the activity for today
         */
        if (item.isFinishedToday == true) {
            UtilityFunc.showAlertWithSingleAction(Strings.FinishedActivityForTodayAlready,()=>{})
        }else{
            navigateToActivityStart(item.id, item.wellnessSubCategoryId, item.completedTime, item.activityLogId)
        }
    }

    const getSelectedTabName = () => {
        if (selectedTabIndex == 0) {
            return "Planned"
        } else if (selectedTabIndex == 1) {
            return "InProcess"
        } else if (selectedTabIndex == 2) {
            return "Completed"
        }
    }


    const navigateToActivityStart = (activityId, subCategoryId,completedTime, activityLogId) => {
        navigation.navigate('ActivityStartScreen', { fromWhere: "MyActivityScreen", fromWhichTabSelection: getSelectedTabName(), activityId: activityId, subCategoryId: subCategoryId, completedTime, activityLogId })
    }

    const onActivityListEndReached = () => {
        if (_.isEmpty(activityListReqBody)) {
            //initial activity list api call
        } else {
            getLoadMoreActivityListApiCall(pageNumberRef.current)
        }
    }

    const navigateToCalendar = useCallback(() => {
        navigation.navigate("CalendarAgenda", { fromWhere: "MyActivityScreen" })
    }, [])

    const onResetComponentError = () => {
        setHasComponentError(false)
        setComponentErrStatus(null)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_ACTIVITY_SCREEN, }} edges={['top']}>
            <Header calendarAction={navigateToCalendar} />
            <MyActivitySegmentControlTab
                tabContainerStyle={{ marginTop: 15, marginHorizontal: 15, height: 55 }}
                selectedIndex={selectedTabIndex}
                onIndexChange={(index) => setSelectedTabIndex(index)}
            />
            <ErrorBoundaryComp hasError={hasComponentError} errStatus={componentErrStatus} onResetError={onResetComponentError}>
                <View style={styles.container}>
                    <MyActivityProgressView />
                    <ActivityList
                        data={activityListData}
                        onItemPress={onActivityItemPressed}
                        isActivityListDataLoaded={isActivityListDataLoaded}
                        onEndReached={onActivityListEndReached}
                        isFooterIndicatorLoading={isLoadMoreActivityList}
                    />
                </View>
            </ErrorBoundaryComp>
        </SafeAreaView>
    )

}


const Header = memo(({ notificationAction = () => { }, calendarAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <Text style={styles.headerText}>{Strings.MyActivity}</Text>
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
})

const MyActivityProgressView = memo(({ }) => {
    return (
        <View style={styles.myActivityProgessCont}>
            <View style={{ flex: 0.55, paddingLeft: 25 }}>
                <Text style={styles.myActivityText}>{"My Activities"}</Text>
                <Text style={styles.myActivityForTodayText}>{"For Today"}</Text>
                <Text style={styles.myActivityCompletedText}>{"1 of 4 completed"}</Text>
            </View>
            <View style={{ flex: 0.45, justifyContent: "center", alignItems: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center", width: 123, height: 123 }}>
                    <Image source={Images.img_myactivity_progress_circle} style={{ width: 120, height: 120, resizeMode: "contain", position: "absolute" }} />
                    <Text style={styles.myActivityPercentage}>{"24%"}</Text>
                </View>
            </View>
        </View>
    )
})

const ActivityList = ({ data = [], onItemPress = () => { }, isActivityListDataLoaded = false, isFooterIndicatorLoading = false, onEndReached = () => { } }) => {
    const renderItem = ({ item, index }) => {
        if (item.actionTypeId == 1) {
            return (
                <ActivityWatch
                    item={item}
                    index={index}
                    onPress={(item, index) => onItemPress(item, index)}
                />
            );
        } else if (item.actionTypeId == 2) {
            return (
                <ActivityListen
                    item={item}
                    index={index}
                    onPress={(item, index) => onItemPress(item, index)}
                />
            );
        } else if (item.actionTypeId == 3) {
            return (
                <ActivityRead
                    item={item}
                    index={index}
                    onPress={(item, index) => onItemPress(item, index)}
                />
            );
        } else if (item.actionTypeId == 4) {
            return (
                <ActivityDo
                    item={item}
                    index={index}
                    onPress={(item, index) => onItemPress(item, index)}
                />
            );
        } else if (item.actionTypeId == 5) {
            return null
        } else {
            return null
        }
    };

    if (data.length == 0) {
        if (isActivityListDataLoaded) {
            return <NoDataFound message={Strings.NoActivityFound} />
        } else {
            return null
        }
    }

    const renderFooterIndicator = () => {
        return <ActivityIndicator color={"tomato"} animating={isFooterIndicatorLoading} size={"small"} style={{ alignSelf: "center", width: "100%" }} />
    }

    return (
        <View style={{ flex: 1, marginTop: 8 }}>
            <FlatList
                data={data}
                style={{ width: "100%", marginBottom: 5 }}
                renderItem={renderItem}
                keyExtractor={() => UtilityFunc.generateRandomKeyForFlatList()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooterIndicator}
            />
        </View>
    )
}

const ActivityWatch = ({ item, index, onPress }) => {
    const thumbnailUrl = item.thumbnail
    return (
        <Pressable onPress={() => onPress(item, index)} style={styles.activityCont}>
            <View style={{ width: "100%", height: 150 }}>
                <Image source={{ uri: thumbnailUrl }} resizeMode={"cover"} style={{ width: "100%", height: "100%", borderTopLeftRadius: 15, borderTopRightRadius: 15 }} />
                <Image source={Images.play_icon} style={{ width: 40, height: 40, resizeMode: "contain", position: "absolute", top: 130, right: 15 }} />
            </View>
            <Text numberOfLines={2} style={[styles.activityTitle, { marginTop: 15, marginHorizontal: 15, width: "70%" }]}>{item.title}</Text>
            <Text numberOfLines={1} style={[styles.activityTitle, { fontFamily:Typography.FONT_FAMILY_MEDIUM ,marginTop: 8, marginHorizontal: 15, width: "70%" }]}>{item.createdOn}</Text>
            <Text style={[styles.activityDesc, { marginVertical: 10, marginBottom: 20, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
        </Pressable>
    )
}
const ActivityRead = ({ item, index, onPress }) => {
    return (
        <Pressable onPress={() => onPress(item, index)} style={styles.activityCont}>
            <Text style={[styles.activityTitle, { marginTop: 15, marginHorizontal: 15 }]}>{item.title}</Text>
            <Text numberOfLines={1} style={[styles.activityTitle, { fontFamily:Typography.FONT_FAMILY_MEDIUM ,marginTop: 8, marginHorizontal: 15, width: "70%" }]}>{item.createdOn}</Text>
            <Text style={[styles.activityDesc, { marginVertical: 10, marginBottom: 20, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
        </Pressable>
    )
}
const ActivityDo = ({ item, index, onPress }) => {
    const thumbnailUrl = item.thumbnail
    return (
        <Pressable onPress={() => onPress(item, index)} style={styles.activityCont}>
            <View style={{ width: "100%", height: 150 }}>
                <Image source={{ uri: thumbnailUrl }} resizeMode={"cover"} style={{ width: "100%", height: "100%", borderTopLeftRadius: 15, borderTopRightRadius: 15 }} />
            </View>
            <Text numberOfLines={2} style={[styles.activityTitle, { marginTop: 15, marginHorizontal: 15 }]}>{item.title}</Text>
            <Text numberOfLines={1} style={[styles.activityTitle, { fontFamily:Typography.FONT_FAMILY_MEDIUM ,marginTop: 8, marginHorizontal: 15, width: "70%" }]}>{item.createdOn}</Text>
            <Text style={[styles.activityDesc, { marginVertical: 10, marginBottom: 20, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
        </Pressable>
    )
}
const ActivityListen = ({ item, index, onPress }) => {
    return (
        <Pressable onPress={() => onPress(item, index)} style={styles.activityCont}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                <Text numberOfLines={2} style={[styles.activityTitle, { marginTop: 15, marginHorizontal: 15, width: "70%" }]}>{item.title}</Text>
                <Image source={Images.play_icon} style={{ width: 40, height: 40, resizeMode: "contain", marginRight: 15, marginTop: 15 }} />
            </View>
            <Text numberOfLines={1} style={[styles.activityTitle, { fontFamily:Typography.FONT_FAMILY_MEDIUM ,marginTop: 8, marginHorizontal: 15, width: "70%" }]}>{item.createdOn}</Text>
            <Text style={[styles.activityDesc, { marginVertical: 10, marginBottom: 20, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
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






export default MyActivityScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 0,
        paddingBottom: 5,
        backgroundColor: "transparent"
    },
    headerCont: {
        width: "100%",
        justifyContent: "space-between",
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerBtnCont: {
        width: 75,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_18
    },
    headerIcon: {
        resizeMode: "contain",
        width: 30,
        height: 30
    },
    myActivityProgessCont: {
        height: 150,
        backgroundColor: Colors.WHITE,
        marginTop: 10,
        borderRadius: 15,
        flexDirection: "row",
        padding: 5
    },
    myActivityText: {
        marginTop: 25,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16
    },
    myActivityForTodayText: {
        marginTop: 8,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_25
    },
    myActivityCompletedText: {
        marginTop: 8,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.GREY
    },
    myActivityPercentage: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_25
    },
    activityCont: {
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: Colors.WHITE
    },
    activityTitle: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_16
    },
    activityDesc: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        color: "grey"
    },
    noDataFoundText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_BOLD,
    }
})