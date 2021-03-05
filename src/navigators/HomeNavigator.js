import * as React from 'react';
import { Image, StyleSheet, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//screens
import { DashboardScreen, MyActivityScreen, CreditsScreen, 
    SubCategoryListScreen, ProfileScreen, ActivityDetailScreen, 
    DrawingDetailScreen, ScheduleActivityScreen, CalendarAgenda, ActivityStartScreen,TimerScreen } from '../scenes/'

//custom utilities
import Images from '../assets/images/'
import Strings from '../themes/Strings'
import { Typography, Colors } from '../styles/'
import { ifIphoneX,isIphoneX } from '../utils/IphoneXHelper'


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeNavigator({ }) {
    console.log('HomeNavigator>>>>')

    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
        const stackName = route.name
        return getOnWhichScreenVisible(stackName,routeName)
    }

    

    return (
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: styles.tabBarText,
                activeTintColor: Colors.ACTIVE_TAB_BAR,
                inactiveTintColor: Colors.BLACK,
                keyboardHidesTabBar: true,
                style: ifIphoneX({}, {
                    height: 60,
                }),
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => renderTabBarIcon(color, route),
                tabBarLabel: ({ color }) => {
                    const bottom = getTabBarVisibility(route) ? 8 : 0
                    return renderTabBarLabel(color, route, bottom )
                },
                tabBarVisible : getTabBarVisibility(route),
            })}
        >
            <Tab.Screen name="DashboardStackNav"
                component={DashboardStackNav}
            />
            <Tab.Screen name="MyActivityStackNav" component={MyActivityStackNav} />
            <Tab.Screen name="CreditsStackNav" component={CreditsStackNav} />
            <Tab.Screen name="ProfileStackNav" component={ProfileStackNav} />
        </Tab.Navigator>
    )

}

function DashboardStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
            <Stack.Screen name="SubCategoryListScreen" component={SubCategoryListScreen} />
            <Stack.Screen name="ActivityDetailScreen" component={ActivityDetailScreen} />
            <Stack.Screen name="DrawingDetailScreen" component={DrawingDetailScreen} />
            <Stack.Screen name="ScheduleActivityScreen" component={ScheduleActivityScreen} />
            <Stack.Screen name="CalendarAgenda" component={CalendarAgenda} />
        </Stack.Navigator>
    )
}

function MyActivityStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyActivityScreen" component={MyActivityScreen} />
            <Stack.Screen name="ActivityStartScreen" component={ActivityStartScreen} />
            <Stack.Screen name="TimerScreen" component={TimerScreen} />
            <Stack.Screen name="CalendarAgenda" component={CalendarAgenda} />
        </Stack.Navigator>
    )
}

function CreditsStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreditsScreen" component={CreditsScreen} />
        </Stack.Navigator>
    )
}

function ProfileStackNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    )
}




//Tab related functions
const getOnWhichScreenVisible = (stackName, routeName) => {
    if (stackName == "DashboardStackNav") {
        if (routeName == "DashboardScreen" || routeName == "") {
            return true
        }else{
            return false
        }
    }else if(stackName == "MyActivityStackNav" || routeName == ""){
        if (routeName == "MyActivityScreen" || routeName == "") {
            return true
        }else{
            return false
        }
    }
    return true
}


function renderTabBarIcon(color, route) {
    let icon;
    switch (route.name) {
        case 'DashboardStackNav':
            icon = Images.dashboard_unselected_icon
            break;
        case 'MyActivityStackNav':
            icon = Images.my_activity_unselected_icon
            break;
        case 'CreditsStackNav':
            icon = Images.credits_unselected_icon
            break;
        case 'ProfileStackNav':
            icon = Images.profile_unselected_icon
            break;
        default:
            break;
    }
    return <Image source={icon} style={{ width: 20, height: 20, resizeMode: "contain", tintColor: color }} />
}

function renderTabBarLabel(color, route, bottom) {
    let labelName;
    switch (route.name) {
        case 'DashboardStackNav':
            labelName = Strings.Dashboard
            break;
        case 'MyActivityStackNav':
            labelName = Strings.MyActivity
            break;
        case 'CreditsStackNav':
            labelName = Strings.Rewards
            break;
        case 'ProfileStackNav':
            labelName = Strings.Profile
            break;
        default:
            break;
    }
    return <Text style={[styles.tabBarText, { color, marginBottom : isIphoneX() ? 0 : bottom }]}>{labelName}</Text>
}


export default HomeNavigator

const styles = StyleSheet.create({
    tabBarText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: 11,
    },
})