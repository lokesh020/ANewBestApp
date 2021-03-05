import React, { useState, useCallback, memo, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


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

// Custom Components
import InputWithLeftIcon from "../../components/InputWithLeftIcon";
import FilledButtonWithImg from "../../components/FilledButtonWithImg";
import TextButton from "../../components/TextButton";


function CreditsScreen() {

    const {logOut} = React.useContext(AuthContext)


    function onBtnLogoutPress() {
        logOut()
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.text}>{"Coming soon...."}</Text>
        </View>
    )
}

export default CreditsScreen

const styles = StyleSheet.create({
    container: {
        flex:1, 
        justifyContent:"center",
        alignItems:"center",
        padding:30
    },
    text : {
        fontFamily:Typography.FONT_FAMILY_REGULAR,
        fontSize:20,
    }
})