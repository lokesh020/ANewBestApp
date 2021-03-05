import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, Keyboard } from 'react-native';

import Images from '../assets/images/'
import {Typography,Colors} from '../styles/'
import * as UtilityFunc from '../utils/UtilityFunc'

function InputWithLeftIcon({ inputContStyle, leftIcon,leftIconStyle,customRef,style, onSubmit ,...props }) {
    let iconSrc = leftIcon ?? Images.no_icon
    const onSubmitEditing = () => {
        if (onSubmit) {
            onSubmit()
        }
    }
    return (
        <View style={[styles.inputContainer, inputContStyle]}>
            <View style={styles.leftIconCont}>
                <Image source={iconSrc} style={[styles.leftIcon,{...leftIconStyle}]} resizeMode={"contain"}/>
            </View>
            <TextInput 
                    style={[styles.input, style]} 
                    autoCorrect={false}
                    autoCapitalize = {"none"} 
                    placeholderTextColor = {Colors.BLACK}
                    maxLength = {100}
                    ref={customRef}
                    blurOnSubmit = {false}
                    onSubmitEditing={onSubmitEditing}
                    {...props} 
                    />
        </View>
    )
}

export default InputWithLeftIcon

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        padding: 5,
        backgroundColor:"white",
        borderRadius : 10
    },
    input: {
        flex: 0.85,
        fontSize : Typography.FONT_SIZE_14,
        color : Colors.BLACK,
        fontFamily : Typography.FONT_FAMILY_REGULAR
    },
    leftIcon: {
        width: 25,
        height: 25,
        marginRight: 5,
    },
    leftIconCont: {
        flex:0.15,
        justifyContent: "center",
        alignItems: "center"
    }
})