import React, { Component } from 'react'
import { Text, StyleSheet, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'

//custom utilities

import { Colors, Typography, Mixins } from '../styles/'
import { isIphoneX } from '../utils/IphoneXHelper'


class CountTimer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            counterValue: this.props.startFromInSeconds
        }
        console.log("min duration>>>",this.props.minCountDuration)
        console.log("min duration>>>",this.props.startFromInSeconds)
    }

    /**
     * component life cycle methods
     */

    componentDidMount(){
        console.log("timer mount>>>>>>>")
        //this.startTimer()
    }

    componentWillUnmount() {
        console.log("timer unmount>>>>>>>")
        this.removeTimer()
    }

    /**
     * business logic methods
     */

    initializeInterval = (callback, timeout = 1000) => {
        this._timer = setInterval(()=>{
            callback()
        }, timeout);
    };

    startTimer = () => {
        this.removeTimer();
        this.initializeInterval(this._updateTimerUI)
    }

    pauseTimer = () => {
        this.removeTimer()
    }

    removeTimer = () => {
        if (this._timer) {
            clearInterval(this._timer)
        }
    }

    _updateTimerUI = () => {
        this.setState((prevState) => { 
            const updatedCountValue = prevState.counterValue + 1
            if (updatedCountValue >= this.props.maxCountDuration ) {// max hours 
                this.props.onMaxCounterValueReached(updatedCountValue)
                this.pauseTimer()
                return { counterValue: 0 } 
            }else if(updatedCountValue == this.props.minCountDuration){
                this.props.onMinCounterDurationReached(updatedCountValue)
                this.pauseTimer()
            }
            return { counterValue: updatedCountValue } 
        });
    }

    _getFormattedTime = () => {
        const {counterValue} = this.state
        const getSeconds = `0${(counterValue % 60)}`.slice(-2)
        const minutes = `${Math.floor(counterValue / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(counterValue / 3600)}`.slice(-2)
        return `${getHours} : ${getMinutes} : ${getSeconds}`
    }

    getCurrentTimerDuration = () => {
        const {counterValue} = this.state
        return counterValue
    }


    /**
     * Renders
     */

    render() {
        const { style } = this.props
        const formattedTime = this._getFormattedTime()
        return (
            <Text style={[styles.timerText, style]}> {formattedTime} </Text>
        )
    }
}

CountTimer.defaultProps = {
};


CountTimer.propTypes = {
    style: PropTypes.object
};

export default CountTimer

const styles = StyleSheet.create({
    timerText: {
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: 30,
    },
})