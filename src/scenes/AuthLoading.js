import React,{useEffect} from 'react'
import { View, Image, StyleSheet,ActivityIndicator } from 'react-native'



function AuthLoading() {
    return (
        <View style = {styles.container}>
            <ActivityIndicator size="large" color="tomato" />
        </View>
    )
}

export default AuthLoading

const styles = StyleSheet.create({
    container: {
        flex:1, 
        justifyContent:"center",
        alignItems:"center"
    },
    logo:{
        width:150,
        height:150
    }
})