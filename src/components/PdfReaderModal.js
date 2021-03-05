import React, { useRef, useState, Component, memo } from 'react'
import PropTypes from "prop-types";
import { View, Modal, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Pdf from 'react-native-pdf';


//custom utilities
import { Colors, Typography, Mixins } from '../styles/'
import {isIphoneX,ifIphoneX} from '../utils/IphoneXHelper'


class PdfReaderModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
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

    handleOnPageChanged = (page, numberOfPages) => {
        console.log(`current page: ${page}`);
    }

    handleOnLoadComplete = (numberOfPages, filePath) => {
        console.log(`number of pages: ${numberOfPages}`);
    }


    handleError = (error) => {
        console.log(">>>>>>>> error", JSON.stringify(error))
    }

    onRef = (ref) => {
        this._pdfRef = ref;
    }



    /**
     * Render methods
     */

    render() {
        const { resource } = this.props // data format = [{label:"",value:0}]
        const { isVisible } = this.state

        return (
            <Modal transparent={true} visible={isVisible} animationType={'slide'}>
                <SafeAreaView style={{ backgroundColor: Colors.BG_ACTIVITY_SCREEN, flex: 1, }}>
                    <PdfContent
                        resource={resource}
                        onLoadComplete={this.handleOnLoadComplete}
                        onError={this.handleError}
                        onRef={this.onRef}
                        onPageChanged={this.handleOnPageChanged}
                    />
                    <Header backAction={this.onBackPress} />
                </SafeAreaView >
            </Modal >
        )
    }

}

const PdfContent = (props) => {
    if (props.resource) {
        console.log("resource", props.resource)
        return (
            <Pdf
                ref = {props.onRef}
                source={props.resource}
                onLoadComplete={props.onLoadComplete}
                onPageChanged={props.onPageChanged}
                onError={props.onError}
                onPressLink={() => { }}
                style={styles.pdfView} />
        );
    }

    return (
        <View style={styles.noContent}>
            <Text style={styles.noContentText}>
                No resources Found
            </Text>
        </View>
    );
};

const Header = memo(({ title = "", backAction = () => { } }) => {
    return (
        <View style={styles.headerCont}>
            <View style={styles.headerBtnCont}>
            </View>
            <Pressable style={styles.headerBackBtn} onPress={backAction}>
                <Entypo name={"circle-with-cross"} size={25} color={"black"} />
            </Pressable>
        </View>
    )
})




PdfReaderModal.defaultProps = {
    onCancel: () => { },
};


PdfReaderModal.propTypes = {
    onCancel: PropTypes.func,
    resource: PropTypes.object, // {uri:"http://xxx/xxx.pdf"}
};


export default PdfReaderModal

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
        ...ifIphoneX({
            top : 60
        },{//regular style
            top: 15
        }),
        flexDirection: "row",
        alignItems: "center",
        position:"absolute"
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
    pdfView: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    noContent: {
        flex: 1,
        alignItems: 'center'
    },
    noContentText: {
        fontSize: 22,
        lineHeight: 36,
        fontWeight: 'bold',
        marginTop: 60,
        textAlign: 'center',
    },
})