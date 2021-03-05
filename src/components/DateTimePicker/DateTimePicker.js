import React, {Component} from "react";
import PropTypes from "prop-types";
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Appearance,
    Pressable,
} from "react-native";

import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import BackDropModalWithAnim from "../BackDropModalWithAnim";
import { isIphoneX } from "../../utils/IphoneXHelper";
import { Mixins } from "../../styles";
import Strings from "../../themes/Strings";

export const BACKGROUND_COLOR_LIGHT = "white";
export const BACKGROUND_COLOR_DARK = "#0E0E0E";
export const BORDER_COLOR = "#d5d5d5";
export const BORDER_RADIUS = 13;
export const BUTTON_FONT_WEIGHT = "normal";
export const BUTTON_FONT_COLOR = "#007ff9";
export const BUTTON_FONT_SIZE = 20;
export const HIGHLIGHT_COLOR_DARK = "#444444";
export const HIGHLIGHT_COLOR_LIGHT = "#ebebeb";
export const TITLE_FONT_SIZE = 20;
export const TITLE_COLOR = "#8f8f8f";

class DateTimePicker extends Component {

    didPressConfirm = false;

    state = {
        date : this.props.initialDate
    }

    show = () => {
        this.modal.show()
    }

    hide = () => {
        this.modal.hide()
    }


    handleCancel = () => {
        this.hide()
        const { onHide } = this.props;
        if (onHide) {
            onHide(this.props.date);
        }
    };

    handleConfirm = () => {
        this.hide()
        const { onConfirm } = this.props;
        if (onConfirm) {
            onConfirm(this.state.date);
        }
    };

    handleHide = () => {
        const { onHide } = this.props;
        if (onHide) {
            onHide(this.props.date);
        }
    };

    onDateChange = (date) => {
       this.setState({date:date})
    };

    render() {
        const {
            onConfirm,
            onChange,
            onHide,
            cancelButtonText,
            confirmButtonText,
            headerText,
            mode,
            dateTimePickerProps,
            minDate,
            maxDate,
            ...otherProps
        } = this.props;

        const {date} = this.state

        const minimumDate = minDate ? minDate : new Date("January 1, 1950") // minimum date for date picker

        const pickerWidth = (Mixins.IS_PLATFORM_ANDROID) ? Mixins.WINDOW_WIDTH - 20 : Mixins.WINDOW_WIDTH - 10

        return (
            <BackDropModalWithAnim
                ref={(ref) => this.modal = ref}
                contentStyle={pickerStyles.modal}
                onHide={this.handleHide}>
                <View style={pickerStyles.container}>
                    <Header title={headerText} />
                    <ThinLine />
                    <DatePicker
                        style={{width : pickerWidth}}
                        date={date}
                        mode={mode}
                        onDateChange = {this.onDateChange}
                        minimumDate = {minimumDate} 
                        maximumDate = {maxDate}
                        {...dateTimePickerProps}
                    />
                    <ThinLine />
                    <ConfirmButton
                        onPress={this.handleConfirm}
                        title={confirmButtonText}
                    />
                </View>
                <CancelButton
                    onPress={this.handleCancel}
                    title={cancelButtonText}
                />
            </BackDropModalWithAnim>
        );
    }
}

const Header = ({ title, style = headerStyles }) => {
    return (
        <View style={style.root}>
            <Text style={style.text}>{title}</Text>
        </View>
    );
};

const ThinLine = () => {
    return (
        <View style={{ width: "100%", height: StyleSheet.hairlineWidth, backgroundColor: "lightgrey" }}></View>
    )
}

const ConfirmButton = ({ title, onPress, style = confirmButtonStyles }) => {
    return (
        <Pressable style={style.button} onPress={onPress}>
            <Text style={style.text}>{title}</Text>
        </Pressable>
    )
}

const CancelButton = ({ title, onPress, style = cancelButtonStyles }) => {
    return (
        <Pressable style={style.button} onPress={onPress}>
            <Text style={style.text}>{title}</Text>
        </Pressable>
    )
}

DateTimePicker.defaultProps = {
    cancelButtonText: Strings.Cancel,
    confirmButtonText: Strings.Confirm,
    headerText: Strings.SelectADate,
    onChange : ()=>{},
    onConfirm : ()=>{},
    onHide : ()=>{},
    mode : "datetime"
}

DateTimePicker.propTypes = {
    date: PropTypes.instanceOf(Date),
    onChange : PropTypes.func,
    onConfirm : PropTypes.func,
    onHide : PropTypes.func,
    mode : PropTypes.string
}

export default DateTimePicker

/**
 * Styles for components
 */

const pickerStyles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 10,
    },
    container: {
        borderRadius: BORDER_RADIUS,
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_COLOR_LIGHT,
    },
});


const headerStyles = StyleSheet.create({
    root: {
        width: "100%",
        height: 40,
        justifyContent: "center"
    },
    text: {
        textAlign: "center",
        color: TITLE_COLOR,
        fontSize: TITLE_FONT_SIZE,
    },
});

const confirmButtonStyles = StyleSheet.create({
    button: {
        borderColor: BORDER_COLOR,
        height: 45,
        justifyContent: "center",
        width: "100%"
    },
    text: {
        textAlign: "center",
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: BUTTON_FONT_WEIGHT,
        backgroundColor: "transparent",
    },
});

const cancelButtonStyles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS,
        height: 50,
        marginBottom: isIphoneX() ? 20 : 0,
        justifyContent: "center",
        backgroundColor: BACKGROUND_COLOR_LIGHT,
    },
    text: {
        padding: 10,
        textAlign: "center",
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: "600",
        backgroundColor: "transparent",
    },
});

