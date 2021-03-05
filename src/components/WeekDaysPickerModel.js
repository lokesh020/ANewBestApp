import React, { useRef, useState, Component, memo } from 'react'
import PropTypes from "prop-types";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'

//custom components
import FilledButtonWithImg from "./FilledButtonWithImg";

//custom utilities
import { Colors, Typography, Mixins } from '../styles/'
import Images from '../assets/images/'
import Strings from '../themes/Strings';


class WeekDaysPickerModel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            isAllDaySelected: false,
            data: [
                {
                    label: "Every Sunday",
                    value: "Sun",
                    selected: false
                },
                {
                    label: "Every Monday",
                    value: "Mon",
                    selected: false
                },
                {
                    label: "Every Tuesday",
                    value: "Tue",
                    selected: false
                },
                {
                    label: "Every Wednesday",
                    value: "Wed",
                    selected: false
                },
                {
                    label: "Every Thursday",
                    value: "Thu",
                    selected: false
                },
                {
                    label: "Every Friday",
                    value: "Fri",
                    selected: false
                },
                {
                    label: "Every Saturday",
                    value: "Sat",
                    selected: false
                }
            ]
        }
    }

    onBackPress = () => {
        this.hide()
    }

    onSelectAllPress = () => {
        const { isAllDaySelected, data } = this.state
        if (isAllDaySelected) {
            const dataWithNoSelectedDay = data.map((x) => ({ ...x, selected: false }));
            this.setState({ data: dataWithNoSelectedDay, isAllDaySelected: false })
        } else {
            const dataWithAllSelectedDay = data.map((x) => ({ ...x, selected: true }));
            this.setState({ data: dataWithAllSelectedDay, isAllDaySelected: true })
        }
    }


    show = () => {
        this.setState({ isVisible: true })
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    onRowPress = (item, index) => {
        const { data } = this.state
        data[index].selected = !item.selected
        const newData = data.map((x) => ({ ...x }));
        /**
         * checks if all array days are selected
         */
        const isAllSelected = newData.every((element) => (element.selected == true))
        this.setState({ data: newData,isAllDaySelected:isAllSelected })
    }

    onSavePress = () => {
        const { data } = this.state
        const filteredData = data.filter((element) => element.selected == true) // filter selected days
        const arrDays = filteredData.map((element) => element.value) // map array into another like ["Mon","Tue"]
        this.setState({ isVisible: false }, () => {
            this.props.onSubmit(arrDays)
        })
    }


    /**
     * Render methods
     */

    render() {
        const { headerText } = this.props // data format = [{label:"",value:0}]
        const { isVisible, data, isAllDaySelected } = this.state

        const renderItem = ({ item, index }) => {
            return (
                <Row key={index} lastIndex={data.length - 1} index={index} item={item} onPress={(item, index) => this.onRowPress(item, index)} />
            )
        }

        return (
            <Modal visible={isVisible} animationType={'slide'}>
                <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1 }} edges={['top']}>
                    <Header title={headerText} backAction={this.onBackPress} isAllSelected={isAllDaySelected} onSelectAll={this.onSelectAllPress} />
                    <View style={styles.mainViewCont}>
                        <FlatList
                            data={data}
                            style={{ width: "100%", borderTopColor: "lightgrey", borderTopWidth: 0.7 }}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => (index.toString())}
                            showsVerticalScrollIndicator={false} />
                        <View style={{ alignItems: "center" }}>
                            <SaveButton onPress={this.onSavePress} />
                        </View>
                    </View>
                </SafeAreaView >
            </Modal >
        )
    }

}

const Row = ({ item, index, onPress, lastIndex }) => {
    return (
        <Pressable key={index} onPress={() => onPress(item, index)} style={[styles.rowCont, {}]}>
            <Text style={styles.rowText}>{item.label}</Text>
            <FontAwesome5 name={"check"} size={17} color={item.selected ? Colors.BLACK : Colors.WHITE} />
        </Pressable>
    )
}

const Header = memo(({ title = Strings.Availability, isAllSelected = false, backAction = () => { }, onSelectAll = () => { } }) => {
    let iconName = isAllSelected ? "checkbox-active" : "checkbox-passive"
    return (
        <View style={styles.headerCont}>
            <Pressable style={styles.headerBackBtn} onPress={backAction}>
                <Entypo name={"circle-with-cross"} size={25} />
            </Pressable>
            <Text style={styles.headerText}>{title}</Text>
            <Pressable style={styles.headerAllDaySelect} onPress={onSelectAll} hitSlop={{ top: 10, bottom: 10, right: 15, left: 15 }}>
                <Fontisto color={Colors.BLACK} name={iconName} size={20} />
            </Pressable>
        </View>
    )
})

const SaveButton = memo(({ onPress = () => { } }) => {
    return (
        <FilledButtonWithImg
            title={Strings.Save.toLocaleUpperCase()}
            textStyle={styles.saveButtonText}
            style={styles.saveButton}
            onPress={onPress}
        />
    )
})

const Line = () => {
    return (
        <View style={{ width: "100%", height: 0.7, backgroundColor: Colors.GREY }}></View>
    )
}



WeekDaysPickerModel.defaultProps = {
    onSubmit: () => { },
    headerText: Strings.Availability
};


WeekDaysPickerModel.propTypes = {
    onSubmit: PropTypes.func,
    headerText: PropTypes.string
};


export default WeekDaysPickerModel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(10,10,10,0.5)"
    },
    mainViewCont: {
        flex: 1,
    },
    rowCont: {
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        display: 'flex',
        height: 45,
        flexDirection: "row",
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 40,
        borderBottomColor: "lightgrey",
        borderBottomWidth: 0.7
    },
    rowText: {
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.BLACK,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
    },
    headerCont: {
        width: "100%",
        justifyContent: "space-between",
        height: 45,
        paddingLeft: 8,
        paddingRight: 15,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    headerAllDaySelect: {
        width: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 25
    },
    headerText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_18,
        textAlign: "center",
        left: 5
    },
    headerIcon: {
        resizeMode: "contain",
        width: 30,
        height: 30
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },
    saveButton: {
        height: 45,
        width: "90%",
        marginBottom: 50
    },
    saveButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_18
    },
})