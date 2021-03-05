import React from 'react'
import {StyleSheet,Text,Pressable,Image, View,Platform} from 'react-native';

import Images from '../assets/images/'

const FilledButtonWithImg = ({title,style,onPress,textStyle,bgImage,borderRadius})=>{
    const image = bgImage ?? Images.img_btnBgGradient 
    return (
        <Pressable style = {[styles.container,style,{borderRadius:borderRadius}]} onPress = {onPress}>
            <View style = {styles.bgImageCont}>
                <Image source = {image} style= {[styles.bgImage,{borderRadius:borderRadius}]} resizeMode = {Platform.OS == "ios" ? "cover" : "cover"}/>
            </View>
            <View style = {styles.textCont}>
                <Text style = {[styles.text,textStyle]}>{title}</Text>
            </View>
        </Pressable>
    )
}

export default FilledButtonWithImg

const styles = StyleSheet.create({
    container : {
        width:"100%",
        flexDirection:"row" 
    },  
    textCont : {    
        width : "100%",
        height : "100%",
        justifyContent :"center",
        alignItems :"center"
    },
    text : {    
        color:'white',
        fontWeight:"500",
        fontSize:18
    },
    bgImageCont : {
        width : "100%",
        height : "100%",
        position :"absolute",
    },
    bgImage : {
        width : "100%",
        height : "100%",
    }
})