import React, { useRef, useState, Component } from 'react'
import PropTypes from "prop-types";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native'

import { Mixins, Typography, Colors } from '../styles/'


class PickerDropDown extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false
        }
    }

    onRowPress = (item, index) => {
        this.setState({ isVisible: false }, () => {
            this.props.onSelect(item, index)
        })
    }

    show = () => {
        this.setState({ isVisible: true })
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    render() {
        const { data, headerText } = this.props // data format = [{label:"",value:0}]
        const { isVisible } = this.state

        const renderItem = ({item,index}) => {
            return (
                <Row key={index} lastIndex={data.length - 1} index={index} item={item} onPress={(item, index) => this.onRowPress(item, index)} />
            )
        }

        return (
            <Modal visible={isVisible} animationType={"none"} transparent={true}>
                <Pressable style={styles.container} onPress={this.hide}>
                    <View style={styles.popUpCont}>
                        <Text style = {{fontFamily:Typography.FONT_FAMILY_MEDIUM,fontSize : 15,marginVertical:10,textAlign:"center"}}>{headerText}</Text>
                        <Line />
                        <FlatList
                            data={data}
                            style={{ width: "100%",marginTop:5}}
                            renderItem={renderItem}
                            bounces={false}
                            keyExtractor = {(item,index)=>(index.toString())}
                            showsVerticalScrollIndicator={false}/>
                    </View>
                </Pressable>
            </Modal >
        )
    }
    
}

const Line = () => {
    return(
        <View style={{width: "100%",height:0.7,backgroundColor:Colors.GREY}}></View>
    )
}

const Row = ({ item, index, onPress, lastIndex }) => {
    const lineSeperatorWidth = (lastIndex == index) ? 0 : 0.7
    return (
        <View style={styles.rowCont}>
            <TouchableOpacity key={index} onPress={() => onPress(item, index)} style={[styles.rowCont, { borderBottomColor: "lightgrey", borderBottomWidth: lineSeperatorWidth }]}>
                <Text style={styles.rowText}>{item.label}</Text>
            </TouchableOpacity>
        </View>
    )
}

PickerDropDown.defaultProps = {
    data: [],
    onSelect: (item, index) => { },
    headerText : "Select Value"
};


PickerDropDown.propTypes = {
    data: PropTypes.array,
    onSelect: PropTypes.func,
    headerText : PropTypes.string
};


export default PickerDropDown

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(10,10,10,0.5)"
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
        elevation: 8,
        borderRadius: 10,
        maxHeight : 300,
        width: Mixins.WINDOW_WIDTH / 2 + 70,
    },
    rowCont: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal:10
    },
    rowText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        padding: 15
    }
})