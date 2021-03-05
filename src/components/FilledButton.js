import React from 'react'
import {StyleSheet,Text,Pressable} from 'react-native';

const FilledButton = ({title,style,onPress,textStyle})=>{
    return (
        <Pressable style = {[styles.container,style]} onPress = {onPress}>
            <Text style = {[styles.text,textStyle]}>{title}</Text>
        </Pressable>
    )
}

export default FilledButton

const styles = StyleSheet.create({
    container : {
        width:"100%",
        alignItems:"center",
        justifyContent:"center",
        padding:20,
        borderRadius:8,
        backgroundColor:'tomato'
    },
    text : {
        color:'white',
        fontWeight:"500",
        fontSize:18
    }
})