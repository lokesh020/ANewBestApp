
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableWithoutFeedback
} from "react-native";


import * as UtilityFunc from '../utils/UtilityFunc'
import { Mixins } from "../styles";


const MODAL_ANIM_DURATION = 300;
const MODAL_BACKDROP_OPACITY = 0.4;

class BackDropModalWithAnim extends Component {

    animVal = new Animated.Value(0);
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    show = () => {
        this.setState({ isVisible: true });
    };


    hide = () => {
        if (this._isMounted) {
            this.setState({ isVisible: false }, this.props.onHide);
        }
    };

    onBackDropPress = () => {
        this.hide()
    }
    

    render() {

        const {
            children,
            contentStyle,
            ...otherProps
        } = this.props;

        const { isVisible } = this.state;

        return (
            <Modal
                transparent
                animationType="none"
                visible={isVisible}
                {...otherProps}>
                <TouchableWithoutFeedback onPress={this.onBackDropPress}>
                    <View
                        style={[
                            styles.backdrop,
                            { width: Mixins.WINDOW_WIDTH, height: Mixins.WINDOW_HEIGHT },
                        ]} />
                </TouchableWithoutFeedback>
                {isVisible && (
                    <View
                        style={[styles.content, contentStyle]}
                        pointerEvents="box-none"
                    >
                        {children}
                    </View>
                )}
            </Modal>
        )
    }


}

BackDropModalWithAnim.defaultProps = {
    onBackdropPress: () => null,
    onHide: () => null,
}
BackDropModalWithAnim.propTypes = {
    onBackdropPress: PropTypes.func,
    onHide: PropTypes.func,
    contentStyle: PropTypes.any,
}

export default BackDropModalWithAnim


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        opacity: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: "flex-end",
    },
});
