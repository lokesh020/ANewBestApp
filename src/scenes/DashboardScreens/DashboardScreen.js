import React, { useState, useCallback, memo, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

//models 
import ParentCategoryModel from '../../models/ParentCategoryModel'

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
import ErrorBoundaryComp from '../../components/ErrorBoundaryComp'


function DashboardScreen({ navigation }) {

    const [hasComponentError, setHasComponentError] = useState(false)
    const [componentErrStatus, setComponentErrStatus] = useState(null)

    const [categoryListData, setCategoryListData] = useState([])
    const [isCategoryDataLoaded, setIsCategoryDataLoaded] = useState(false)


    useEffect(() => {
        //api calling
        if (hasComponentError == false) {
            getCategoryListDataApi()
        }
    }, [hasComponentError])

    const getCategoryListDataApi = () => {
        const body = {
            "pageNumber": 1,
            "pageSize": 20,
            "parentCategoryId": 0
        }
        ApiManager.makePostRequest(true, WebConstants.kGetCategoryOrSubcategoryList, body).then((response) => {
            const arrData = response.data.map((element, i) => {
                const model = new ParentCategoryModel(element)
                return model
            })
            setCategoryListData(arrData)
            setIsCategoryDataLoaded(true)
        }).catch((errStatus) => {
            setHasComponentError(true)
            setComponentErrStatus(errStatus)
        })
    }

    const onRowPress = (item, index) => {
        navigateToSubCategory(item)
    }

    const navigateToSubCategory = (item) => {
        navigation.navigate("SubCategoryListScreen", { fromWhere: "DashboardScreen", parentCategoryId: item.id, parentCategoryName: item.title, parentCateBgColor: item.backGroundColor })
    }

    const navigateToCalendar = useCallback(() => {
        navigation.navigate("CalendarAgenda", { fromWhere: "DashboardScreen" })
    },[])

    const onResetComponentError = () => {
        setHasComponentError(false)
        setComponentErrStatus(null)
    }
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_SCREEN, }} edges={['top']}>
            <Header calendarAction = {navigateToCalendar}/>
            <ErrorBoundaryComp hasError = {hasComponentError} errStatus = {componentErrStatus} onResetError = {onResetComponentError}>
                <WellnessActivityLogo />
                <View style={styles.container}>
                    <CategoryList data={categoryListData} onRowPress={onRowPress} isDataLoaded={isCategoryDataLoaded} />
                </View>
            </ErrorBoundaryComp>
        </SafeAreaView>
    )

}


const Header = ({ notificationAction = () => { }, calendarAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <Text style={styles.headerText}>{Strings.MyDashboard}</Text>
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

const WellnessActivityLogo = React.memo(() => {
    return (
        <View style={styles.wellnessLogoCont}>
            <Image source={Images.img_wellness_activity_logo} style={styles.wellnessLogoImg} resizeMode="cover" />
            <View style={{ marginLeft: 30, marginBottom: 40, width: 120 }}>
                <Text style={styles.wellnessText}>{Strings.Wellness}</Text>
                <Text style={styles.activitiesText}>{Strings.Activities}</Text>
            </View>
        </View>
    )
})


const CategoryList = ({ data = [], onRowPress = () => { }, isDataLoaded = false }) => {

    const renderItem = ({ item, index }) => {
        return (
            <Category
                item={item}
                onPress={() => onRowPress(item, index)}
            />
        );
    };

    if (data.length == 0) {
        if (isDataLoaded) {
            return <NoDataFound message={Strings.NoDataFound} />
        } else {
            return null
        }
    }

    return (
        <FlatList
            data={data}
            style={{ flex: 1, margin: 20, marginBottom: 0 }}
            renderItem={renderItem}
            numColumns={2}
            bounces={false}
            showsVerticalScrollIndicator={false}
        />
    )
}

const Category = ({ item, onPress }) => {
    const thumbnailUrl = item.thumbnail
    return (
        <Pressable onPress={onPress} style={styles.categoryItemCont}>
            <View style={[styles.categoryItem, { backgroundColor: item.backGroundColor }]}>
                <Image source={{ uri: thumbnailUrl }} style={styles.categoryItemImg} />
                <Text style={styles.categoryItemText}>{item.title}</Text>
            </View>
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






export default DashboardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    wellnessLogoCont: {
        ...Mixins.margin(0, 20, 0, 20),
        height: isIphoneX() ? 180 : 160,
        justifyContent: "flex-end"
    },
    wellnessLogoImg: {
        position: "absolute",
        width: "100%",
        height: isIphoneX() ? 180 : 160,
        borderRadius: 20
    },
    wellnessText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
    },
    activitiesText: {
        fontSize: Typography.FONT_SIZE_22,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_BOLD,
    },
    categoryItemCont: {
        height: Math.round(Mixins.WINDOW_WIDTH / 2) - 30,
        flex: 1,
    },
    categoryItem: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    categoryItemImg: {
        width: 55,
        height: 55,
        resizeMode: "contain",
        marginBottom: 15
    },
    categoryItemText: {
        fontSize: Typography.FONT_SIZE_15,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        width: 110,
        textAlign: "center"
    },
    noDataFoundText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_BOLD,
    }
})