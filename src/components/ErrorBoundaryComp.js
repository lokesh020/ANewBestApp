import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import PropTypes from "prop-types";

import Images from '../assets/images/'
import { Typography, Colors } from '../styles/'
import Strings from '../themes/Strings'

class ErrorBoundaryComp extends Component {

    constructor(props) {
        super(props)
    }

    onPress = () => {
        this.props.onResetError()
    }

    render() {
        const { errStatus } = this.props
        const { hasError } = this.props
        const title = (errStatus != null) ? errStatus.statusTitle : "Default error"
        const message = (errStatus != null) ? errStatus.statusMsg : "Nothing has happened"
        if (hasError) {
            return (
                <View style={styles.container}>
                    <View style={{ alignItems: "center", justifyContent: "center", bottom: 40, width: "100%" }}>
                        <Image source={Images.sad_cloud_icon} style={styles.sadImg} />
                        <Text style={styles.title}>{title}</Text>
                        <Text numberOfLines={4} style={styles.message}>{message}</Text>
                        <TouchableOpacity style={styles.tryAgainButton} onPress={this.onPress}>
                            <Image source={Images.retry_again_icon} style={styles.tryAgainIcon} />
                            <Text style={styles.tryAgainButtonText}>{Strings.TryAgain}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return this.props.children
        }
    }

}




ErrorBoundaryComp.defaultProps = {
    errStatus: { statusTitle: "", statusMsg: "" },
    hasError: false,
    onResetError: () => { }
};


ErrorBoundaryComp.propTypes = {
    errStatus: PropTypes.object,
    hasError: PropTypes.bool,
    onResetError: PropTypes.func
};


export default ErrorBoundaryComp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BG_ACTIVITY_SCREEN
    },
    sadImg: {
        width: 130,
        height: 120,
        resizeMode: "contain",
        tintColor: "#555555",
    },
    title: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_17,
        color: "#555555",
        marginTop: 0,
    },
    message: {
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_16,
        color: "#555555",
        textAlign: "center",
        width: "70%",
        marginTop: 10
    },
    tryAgainButton: {
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        marginTop: 10
    },
    tryAgainButtonText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_17,
        color: "#555555"
    },
    tryAgainIcon: {
        width: 22,
        height: 22,
        resizeMode: "cover",
        tintColor: "#555555",
        marginRight: 5
    }
})