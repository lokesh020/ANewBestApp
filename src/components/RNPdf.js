import React, { useRef, useState, Component, memo } from 'react'
import PropTypes from "prop-types";
import { View, Modal, StyleSheet, Pressable } from 'react-native'
import Pdf from 'react-native-pdf';

//custom utilities
import { Colors, Typography, Mixins } from '../styles/'
import {isIphoneX,ifIphoneX} from '../utils/IphoneXHelper'


class RNPdf extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }


    handleOnPageChanged = (page, numberOfPages) => {
        console.log(`current page: ${page}`);
        this.props.onPageChanged(page,numberOfPages)
    }

    handleOnLoadComplete = (numberOfPages, filePath) => {
        console.log(`number of pages: ${numberOfPages}`);
        this.props.onLoadComplete(numberOfPages,filePath)
    }

    handleError = (error) => {
        console.log("rn pdf error", JSON.stringify(error))
        this.props.onError(error)
    }

    onRef = (ref) => {
        this.props.onRef(ref)
    }

    render() {
        const {pdfViewStyle,resource} = this.props
        return (
            <Pdf
                ref = {this.onRef}
                source={resource}
                onLoadComplete={this.handleOnLoadComplete}
                onPageChanged={this.handleOnPageChanged}
                onError={this.handleError}
                onPressLink={() => { }}
                style={[styles.pdfView,pdfViewStyle]} />
        )
    }
}

RNPdf.defaultProps = {
    onRef : ()=>{},
    onLoadComplete: ()=>{},
    onPageChanged: ()=>{},
    onError: ()=>{},
};


RNPdf.propTypes = {
    onRef : PropTypes.func,
    onLoadComplete: PropTypes.func,
    onPageChanged: PropTypes.func,
    onError: PropTypes.func,
    resource: PropTypes.object.isRequired, // {uri:"http://xxx/xxx.pdf"}
};

export default RNPdf

const styles = StyleSheet.create({
    pdfView: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
})