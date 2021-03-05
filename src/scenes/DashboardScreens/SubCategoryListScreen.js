import React, { useState, useCallback, memo, useEffect, createRef, useRef } from 'react'
import { View, Text, StyleSheet, Pressable, Image, FlatList,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '../../components/RNKeyboardAwareScrollView/'
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

//models 
import { SubCategoryModel, ActivityModel } from '../../models/'

// Contexts
import AuthContext from './../../contexts/AuthContext'
import SpinnerModalContext from "../../contexts/SpinnerModalContext";

// Custom Utilities
import * as SessionManager from '../../utils/SessionManager'
import WebConstants from '../../utils/networkController/WebConstants';
import ApiManager from '../../utils/ApiManager'
import * as UtilityFunc from '../../utils/UtilityFunc'
import * as FlashManager from '../../utils/FlashManager'
import { Colors, Typography, Mixins } from '../../styles/'
import Images from '../../assets/images/'
import Strings from '../../themes/Strings';
import { isIphoneX } from '../../utils/IphoneXHelper'

// Custom Components
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";
import DropDownPicker from '../../components/DropDown'
import PickerDropDown from '../../components/PickerDropDown';
import ErrorBoundaryComp from '../../components/ErrorBoundaryComp'

const durationData = [
    { label: "No duration", value: 0 },
    { label: "10 min", value: 10 },
    { label: "15 min", value: 15 },
    { label: "20 min", value: 20 },
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "35 min", value: 35 },
    { label: "40 min", value: 40 },
    { label: "45 min", value: 45 },
    { label: "50 min", value: 50 },
    { label: "55 min", value: 55 },
    { label: "60 min", value: 60 },
]

const activityFilterData = [
    { label: "All", value: 0 },
    { label: "Watch", value: 1 },
    { label: "Listen", value: 2 },
    { label: "Read", value: 3 },
    { label: "Do", value: 4 },
]

let activityListReqBody = {}

const activityDropDownPickerRef = createRef();
const durationDropDownPickerRef = createRef();

function SubCategoryListScreen({ navigation, route }) {


    const { fromWhere, parentCategoryId, parentCategoryName, parentCateBgColor } = route.params;

    const [hasComponentError, setHasComponentError] = useState(false)
    const [componentErrStatus, setComponentErrStatus] = useState(null)

    const [isLoadMoreActivityList, setIsLoadMoreActivityList] = useState(false)

    const [subCategoryListData, setSubCategoryListData] = useState([])
    const [isSubCategoryDataLoaded, setIsSubCategoryDataLoaded] = useState(false)

    const [activityListData, setActivityListData] = useState([])
    const [isActivityListDataLoaded, setIsActivityListDataLoaded] = useState(false)

    const [selectedSubCategoryItem, setSelectedSubCategoryItem] = useState(null)


    const [durationValue, setDurationValue] = useState(0);// default all min selected
    const [activityFilterValue, setActivityFilterValue] = useState(0);// default all selected

    const pageNumberRef = useRef(2) // for next page activity list

    useEffect(() => {
        //Api calling
        if (hasComponentError == false) {
            getSubCategoryListData()
        }
    }, [hasComponentError])

    const onBackPress = useCallback(() => {
        navigation.goBack()
    },[])

    const navigateToCalendar = useCallback(() => {
        navigation.navigate("CalendarAgenda", { fromWhere: "SubCategoryListScreen" })
    },[])

    const onSubCategoryItemPressed = (item, index) => {
        subCategoryListData.forEach((element, i) => {
            if (element.id == item.id) {
                element.isSelected = true
            } else {
                element.isSelected = false
            }
        })
        setSelectedSubCategoryItem({ ...item })
        setSubCategoryListData([...subCategoryListData])
        getActivityListApiCall(item.id, durationValue ?? 0, activityFilterValue ?? 0)
    }

    //Api call
    const getSubCategoryListData = () => {
        const body = {
            "pageNumber": 1,
            "pageSize": 50,
            "parentCategoryId": parentCategoryId
        }
        ApiManager.makePostRequest(true, WebConstants.kGetCategoryOrSubcategoryList, body).then((response) => {
            const arrData = response.data.map((element, i) => {
                const model = new SubCategoryModel(element)
                return model
            })
            setSubCategoryListData(arrData)
            setIsSubCategoryDataLoaded(true)

            //Get activities api call after subcategory api 
            if (arrData.length > 0) {
                getActivityListApiCall(0, 0, 0)
            }

        }).catch((errStatus) => {
            setHasComponentError(true)
            setComponentErrStatus(errStatus)
        })
    }

    const getActivityListApiCall = (subCategoryId, duration, actionTypeId, pageNumber = 1) => {
        pageNumberRef.current = 2 // whenever calls pagenumber set to initial
        const body = {
            "categoryId": parentCategoryId,
            "subCategoryId": subCategoryId,
            "duration": duration,
            "actionTypeId": actionTypeId,
            "pageNumber": pageNumber,
            "pageSize": 10
        }
        activityListReqBody = {...body}
        ApiManager.makePostRequest(true, WebConstants.kGetActivityList, body).then((response) => {
            const arrData = response.data.map((element, i) => {
                const model = new ActivityModel(element)
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
        const body = {...activityListReqBody,pageNumber}
        setIsLoadMoreActivityList(true)
        ApiManager.makePostRequest(false, WebConstants.kGetActivityList, body).then((response) => {
            setIsLoadMoreActivityList(false)
            const arrData = response.data.map((element, i) => {
                const model = new ActivityModel(element)
                return model
            })
            if (arrData.length == 0) {
            }else{
                pageNumberRef.current = pageNumberRef.current+1
                setActivityListData([...activityListData,...arrData])
            }
        }).catch((errStatus) => {
            setHasComponentError(true)
            setComponentErrStatus(errStatus)
        })
    }



    const onResetComponentError = () => {
        setHasComponentError(false)
        setComponentErrStatus(null)
    }


    const onFilterButtonPressed = () => {
        if (selectedSubCategoryItem != null) {
            getActivityListApiCall(selectedSubCategoryItem.id, durationValue ?? 0, activityFilterValue ?? 0)
        } else {
            getActivityListApiCall(0, durationValue ?? 0, activityFilterValue ?? 0)
        }
    }

    const onActivityItemPressed = (item, index) => {
        navigateToActivityDetail(item.id, item.wellnessSubCategoryId)
    }
    const navigateToActivityDetail = (activityId, subCategoryId) => {
        navigation.navigate('ActivityDetailScreen', { fromWhere: "SubCategoryListScreen", activityId: activityId, subCategoryId: subCategoryId })
    }

    const onActivityListEndReached = () => {
       if (_.isEmpty(activityListReqBody)) {
           //initial activity list api call
       }else{
           getLoadMoreActivityListApiCall(pageNumberRef.current)
       }
    }

    const FilterRow = () => {
        if (subCategoryListData.length == 0) {
            return null
        }
        return (
            <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: "space-between" }}>
                <DurationFilter
                    data={durationData}
                    value={durationValue}
                    onSelectValue={({ value }) => {
                        setDurationValue(value)
                    }}
                />
                <ActivityFilter
                    data={activityFilterData}
                    value={activityFilterValue}
                    onSelectValue={({ value }) => {
                        setActivityFilterValue(value)
                    }}
                />
                <FilterButton
                    onPress={() => {
                        durationDropDownPickerRef.current?.close()
                        activityDropDownPickerRef.current?.close()
                        onFilterButtonPressed()
                    }}
                />
            </View>
        )
    }


    return (
        <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1 }} edges={['top']}>
            <Header title={parentCategoryName} backAction={onBackPress} calendarAction={navigateToCalendar}/>
            <ErrorBoundaryComp hasError={hasComponentError} errStatus={componentErrStatus} onResetError={onResetComponentError}>
                <View style={styles.container}>
                    <SubCategoryList
                        data={subCategoryListData}
                        onItemPress={onSubCategoryItemPressed}
                        isSubCategoryDataLoaded={isSubCategoryDataLoaded}
                        selectedColor={parentCateBgColor}
                    />
                    <FilterRow />
                    <SubCategoryTitle title={selectedSubCategoryItem?.title ?? ""} />
                    <ActivityList
                        data={activityListData}
                        onItemPress={onActivityItemPressed}
                        isActivityListDataLoaded={isActivityListDataLoaded}
                        onEndReached = {onActivityListEndReached}
                        isFooterIndicatorLoading = {isLoadMoreActivityList}
                    />
                </View>
            </ErrorBoundaryComp>
        </SafeAreaView>
    )

}

const Header = memo(({ title = "", backAction = () => { }, notificationAction = () => { }, calendarAction = () => { } }) => {
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
})

const SubCategoryTitle = memo(({ title = "" }) => {
    if (title == "")
        return null
    return (
        <Text style={styles.subCategoryTitle}>{title}</Text>
    )
})

const DurationFilter = ({ data = [], value = 0, onSelectValue = () => { } }) => {

    const pickerRef = useRef(null)
    const [pickerLabel, setPickerLabel] = useState("")

    useEffect(() => {
        if (value == null) {
            setPickerLabel(Strings.NoDuration)
        } else {
            const obj = data.find(element => element.value === value)
            setPickerLabel(obj.label)
        }
    }, [value])

    const onPickerPress = () => {
        pickerRef.current?.show()
    }

    return (
        <View style={styles.durationFilterCont}>
            <Pressable style={styles.filter} onPress={onPickerPress}>
                <Text style={styles.durationText}>{pickerLabel}</Text>
                <Icon name={Images.dropdown_icon_name} size={15} />
            </Pressable>
            <PickerDropDown
                headerText={Strings.SelectDuration}
                ref={pickerRef}
                data={data}
                onSelect={(item, index) => onSelectValue(item, index)}
            />
        </View>
    )
}

const ActivityFilter = ({ data = [], value = () => { }, onSelectValue = () => { } }) => {

    const pickerRef = useRef(null)
    const [pickerLabel, setPickerLabel] = useState("")

    useEffect(() => {
        if (value == null) {
            setPickerLabel(Strings.AllActivity)
        } else {
            const obj = data.find(element => element.value === value)
            setPickerLabel(obj.label)
        }
    }, [value])

    const onPickerPress = () => {
        pickerRef.current?.show()
    }

    return (
        <View style={styles.activityFilterCont}>
            <Pressable style={[styles.filter, { paddingHorizontal: 10 }]} onPress={onPickerPress}>
                <Text style={styles.durationText}>{pickerLabel}</Text>
                <Icon name={Images.dropdown_icon_name} size={15} />
            </Pressable>
            <PickerDropDown
                headerText={Strings.SelectAction}
                ref={pickerRef}
                data={data}
                onSelect={(item, index) => onSelectValue(item, index)}
            />
        </View>
    )
}

const FilterButton = ({ onPress = () => { } }) => {
    return (
        <View style={styles.btnFilerCont}>
            <FilledButtonWithImg title={Strings.Filter} textStyle={styles.filterButtonText} style={styles.filterButton} onPress={onPress} borderRadius={8} />
        </View>
    )
}




const SubCategoryList = ({ data = [], onItemPress = () => { }, isSubCategoryDataLoaded = false, selectedColor = "" }) => {
    const renderItem = ({ item, index }) => {
        return (
            <SubCategory
                item={item}
                selectedColor={selectedColor}
                index={index}
                onPress={(item, index) => onItemPress(item, index)}
            />
        );
    };

    if (data.length == 0) {
        if (isSubCategoryDataLoaded) {
            return <NoDataFound message={Strings.NoDataFound} />
        } else {
            return null
        }
    }

    return (
        <View style={{ width: "100%", marginTop: 8 }}>
            <FlatList
                data={data}
                style={{ width: "100%" }}
                renderItem={renderItem}
                horizontal={true}
                bounces={false}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const SubCategory = ({ item, index, onPress, selectedColor }) => {
    const thumbnailUrl = item.thumbnail
    const isSelected = item.isSelected
    return (
        <Pressable onPress={() => onPress(item, index)} style={[styles.subCategoryItemCont]}>
            <View style={[styles.subCategoryItem, { backgroundColor: isSelected ? selectedColor : Colors.WHITE }]}>
                <Image source={{ uri: thumbnailUrl }} style={[styles.subCategoryItemImg, { tintColor: isSelected ? Colors.WHITE : Colors.BLACK }]} />
            </View>
        </Pressable>
    )
}


const ActivityList = ({ data = [], onItemPress = () => { }, isActivityListDataLoaded = false, isFooterIndicatorLoading = false  ,onEndReached = ()=>{} }) => {
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

    const renderFooterIndicator = () =>{
        return <ActivityIndicator color={"tomato"} animating={isFooterIndicatorLoading} size = {"small"} style={{alignSelf:"center",width:"100%"}}/>
    }

    return (
        <View style={{ flex: 1, marginTop: 8 }}>
            <FlatList
                data={data}
                style={{ width: "100%" ,marginBottom:5}}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached = {onEndReached}
                onEndReachedThreshold = {0.1}
                showsVerticalScrollIndicator={false}
                ListFooterComponent = {renderFooterIndicator}
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
            <Text style={[styles.activityDesc, { marginVertical: 15, marginBottom: 30, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
        </Pressable>
    )
}
const ActivityRead = ({ item, index, onPress }) => {
    return (
        <Pressable onPress={() => onPress(item, index)} style={styles.activityCont}>
            <Text style={[styles.activityTitle, { marginTop: 15, marginHorizontal: 15 }]}>{item.title}</Text>
            <Text numberOfLines={2} style={[styles.activityDesc, { marginVertical: 15, marginBottom: 30, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
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
            <Text style={[styles.activityDesc, { marginVertical: 15, marginBottom: 30, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
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
            <Text style={[styles.activityDesc, { marginVertical: 15, marginBottom: 30, marginHorizontal: 15 }]} numberOfLines={3}>{item.desc}</Text>
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






export default SubCategoryListScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 0,
        paddingBottom:5,
        backgroundColor: "transparent"
    },
    headerCont: {
        width: "100%",
        justifyContent: "space-between",
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        paddingHorizontal: 15
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
    noDataFoundText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_BOLD,
    },
    subCategoryItemCont: {
        height: 100,
        width: 100
    },
    subCategoryItem: {
        flex: 1,
        margin: 5,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red"
    },
    subCategoryItemImg: {
        width: "50%",
        height: "50%",
        borderRadius: 10,
        resizeMode: "cover",
    },

    subCategoryTitle: {
        marginTop: Mixins.scaleRatio(3),
        marginLeft: 8,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_17,
    },

    durationText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_14,
        color: Colors.BLACK,
        flex: 1,
        textAlign: "center"
    },

    filter: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        flexDirection: "row",
        width: "100%",
        height: "100%",
        alignItems: "center",
        paddingHorizontal: 10
    },

    durationFilterCont: {
        flex: 0.35,
        height: 40,
    },

    activityFilterCont: {
        flex: 0.30,
        height: 40,
    },

    btnFilerCont: {
        flex: 0.30,
        height: 40,
    },
    filterButton: {
        height: 40,
        width: "100%",
    },
    filterButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_16
    },
    dropDownCont: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingHorizontal: 10
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
    }

})