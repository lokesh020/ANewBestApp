import React, { useRef, useState, Component, memo } from 'react'
import PropTypes from "prop-types";
import { View, Modal, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import VideoPlayer from './RNVideoPlayer/'
import Orientation from 'react-native-orientation-locker';
import ScrollView from './RNVideoPlayer/components/ScrollView'

//custom utilities
import { Colors, Typography, Mixins } from '../styles/'



class VideoPlayerModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            isFullScreen: false
        }
    }

    onBackPress = () => {
        this.hide()
    }


    show = () => {
        this.setState({ isVisible: true })
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    backHandler = () => {
        const { isFullScreen } = this.state
        if (isFullScreen) {
            this.setState({ isFullScreen: false }, () => {
                Orientation.lockToPortrait()
            })
        }
    }




    /**
     * Render methods
     */

    render() {
        const { url, poster } = this.props // data format = [{label:"",value:0}]
        const { isVisible, isFullScreen } = this.state

        return (
            <Modal visible={isVisible} transparent={!isFullScreen} animationType={'slide'} supportedOrientations={['portrait', 'landscape']} onRequestClose={this.backHandler}>
                <SafeAreaView style={{ backgroundColor: "rgba(50,50,50,0.8)", flex: 1 }}>
                    {(!isFullScreen) && <Header backAction={this.onBackPress} />}
                    <VideoPlayer
                        ref={(ref) => this.player = ref}
                        url={url}
                        rotateToFullScreen={true}
                        videoProps={{
                            poster: poster
                        }}
                        lockRatio={16 / 9}
                        onFullScreen={(isFullScreen) => this.setState({ isFullScreen: isFullScreen })}
                    />
                </SafeAreaView >
            </Modal >
        )
    }

}

const Header = memo(({ title = "", backAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <Pressable style={styles.headerBackBtn} onPress={backAction}>
                <Entypo name={"circle-with-cross"} size={25} color={"white"} />
            </Pressable>
            <View style={styles.headerBtnCont}>
            </View>
        </View>
    )
})




VideoPlayerModal.defaultProps = {
    onCancel: () => { },
    poster: "",
    url: ""
};


VideoPlayerModal.propTypes = {
    onCancel: PropTypes.func,
    url: PropTypes.string,
    poster: PropTypes.string
};


export default VideoPlayerModal

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
    headerBtnCont: {
        width: 70,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
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
})