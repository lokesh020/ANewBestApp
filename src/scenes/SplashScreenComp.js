import React, { useEffect } from 'react'
import { View, Image, StyleSheet,Text } from 'react-native'
import { StackActions } from '@react-navigation/native';

import Constants from '../utils/Constants'

import Images from '../assets/images/'
import { Typography } from '../styles';

function SplashScreenComp({ route, navigation }) {

    function navigateToRootStack() {
        navigation.dispatch(
            StackActions.replace('RootNavigator')
        )
    }

    useEffect(() => {
        setTimeout(() => {
            navigateToRootStack()
        }, 2000);
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.splashBgCont}>
                <Image source={Images.img_logo_circle} style={styles.splashBg} resizeMode={"cover"} />
                <Text style = {styles.splashText}>{"Mind.Body.Soul"}</Text>
            </View>
            <View style={[styles.container, { justifyContent: "flex-end", alignItems: "center" }]}>
                <Text style = {styles.versionText}>{"Version :- "+Constants.APP_VERSION}</Text>
            </View>
        </View>
    )
}

export default SplashScreenComp

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    splashBgCont: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    splashBg: {
        width: 200,
        height: 200,
    },
    splashText: {
        fontFamily:Typography.FONT_FAMILY_REGULAR,
        fontSize:20,
        marginTop:25
    },
    versionText :{
        fontFamily:Typography.FONT_FAMILY_MEDIUM,
        fontSize:15,
        marginTop:25,
        marginBottom : 30
    }
})