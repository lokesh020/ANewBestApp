import React from 'react'
import {StyleSheet,Text,Pressable} from 'react-native';

import {Typography} from '../styles/'

function TextButton({title,style,onPress,textStyle}) {
    return (
        <Pressable style = {[styles.container,style]} onPress = {onPress}>
            <Text style = {[styles.text,textStyle]}>{title}</Text>
        </Pressable>
    )
}

export default TextButton

const styles = StyleSheet.create({
    container : {
        alignItems:"center",
        justifyContent:"center",
    },
    text : {
        fontFamily : Typography.FONT_FAMILY_REGULAR
    }
})