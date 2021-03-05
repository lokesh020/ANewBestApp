import React, { useRef, useState, Component } from 'react'
import PropTypes from "prop-types";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';


import ImagePickerManager from '../utils/ImagePickerManager'

import { Mixins, Typography, Colors } from '../styles/'
import Strings from '../themes/Strings';


class ImagePickerModel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            data : [
                {
                    iconName : "add-a-photo",
                    title : Strings.OpenCamera
                },
                {
                    iconName : "photo",
                    title : Strings.OpenGallery 
                }
            ]
        }
    }

    onRowPress = (item, index) => {
        const {onSelectImage,imageOptions} = this.props
        this.setState({ isVisible: false },()=>{
            switch (index) {
                case 0:
                    ImagePickerManager.showCamera(imageOptions).then((response) => {
                        onSelectImage(response)
                    }).catch((err) => { })
                    break;
                case 1:
                    ImagePickerManager.showGallery(imageOptions).then((response) => {
                        onSelectImage(response)
                    }).catch((err) => { })
                    break;
                default:
                    break;
            }
        })
    }

    show = () => {
        this.setState({ isVisible: true })
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    render() {
        const { onBackDropHandler,onRequestClose } = this.props
        const { isVisible,data } = this.state
        return (
            <Modal visible={isVisible} animationType={"none"} transparent={true} onRequestClose = {onRequestClose}>
                <Pressable style={styles.container} onPress={onBackDropHandler}>
                    <View  style={styles.popUpCont}>
                            {data.map((element, index) => {
                                return <Row key={index} lastIndex={data.length - 1} index={index} item={element} onPress={(item, index) => this.onRowPress(item, index)} />
                            })}
                    </View>
                </Pressable>
            </Modal>
        )
    }
}

const Row = ({ item, index, onPress, lastIndex }) => {
    const lineSeperatorWidth = (lastIndex == index) ? 0 : 0.7
    return (
        <TouchableOpacity key={index} onPress={() => onPress(item, index)} style={[styles.rowCont,{borderBottomWidth: lineSeperatorWidth }]}>
            <Icon name = {item.iconName} size = {25} style = {{marginRight : 10}}/>
            <Text style={styles.rowText}>{item.title}</Text>
        </TouchableOpacity>
    )
}

ImagePickerModel.defaultProps = {
    onSelectImage: () => { },
    onBackDropHandler: () => { },
    onRequestClose: () => { },
    imageOptions: {} // image picker options
};


ImagePickerModel.propTypes = {
    onSelectImage: PropTypes.func,
    onBackDropHandler: PropTypes.func,
    onRequestClose : PropTypes.func,
    imageOptions : PropTypes.object
};


export default ImagePickerModel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(10,10,10,0.7)"
    },
    popUpCont: {
        backgroundColor: "white",
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 10,
        padding: 10 ,
        borderRadius:10
    },
    rowCont: {
        width: Mixins.WINDOW_WIDTH / 2 + 50,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "lightgrey",
        flexDirection:"row"
    },
    rowText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        padding: 15,
        width:"60%"
    }
})