import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import PropTypes from "prop-types";

import Images from '../assets/images/'
import { Typography, Colors } from '../styles/'
import Strings from '../themes/Strings'

class GlobalErrorBoundary extends React.Component{

  state = { error: null }

  static getDerivedStateFromError (error) {
    return { error }
  }

  componentDidCatch (error, info) {
    console.log("Globar component error>>>>>>",JSON.stringify(error))
  }

  resetError = () => {
    this.setState({ error: null })
  }

  render () {

    return this.state.error
      ? <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      : this.props.children
  }
}

const FallbackComponent = ({error,resetError}) => {
    return(
        <View style={styles.container}>
                    <View style={{ alignItems: "center", justifyContent: "center", bottom: 40, width: "100%" }}>
                        <Image source={Images.sad_cloud_icon} style={styles.sadImg} />
                        <Text style={styles.title}>{Strings.OopsSomethingWentWrong}</Text>
                        <Text numberOfLines={4} style={styles.message}>{error.toString()}</Text>
                        <TouchableOpacity style={styles.tryAgainButton} onPress={resetError}>
                            <Image source={Images.retry_again_icon} style={styles.tryAgainIcon} />
                            <Text style={styles.tryAgainButtonText}>{Strings.TryAgain}</Text>
                        </TouchableOpacity>
                    </View>
        </View>
    )
}

export default GlobalErrorBoundary

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