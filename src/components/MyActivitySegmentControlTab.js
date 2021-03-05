import React, { Component, memo } from 'react'
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


//custom utilities
import { Colors, Typography } from '../styles/'
import Strings from '../themes/Strings'



class MyActivitySegmentControlTab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: [
                { title: Strings.Planned, index: 0 },
                { title: Strings.InProgress, index: 1 },
                { title: Strings.Completed, index: 2 }
            ],
            tabItemWidth: 0,
            tabItemHeight : 0
        }
    }



    handleOnIndexChange = (selectedIndex) => {
        this.props.onIndexChange(selectedIndex)
    }

    onLayoutMainContainer = (event) => {
        let { width,height } = event.nativeEvent.layout;
        this.setState({ tabItemWidth: (width / 3 - 5), tabItemHeight:height })
    }



    /**
     * Render methods
     */

    render() {
        const { selectedIndex, tabContainerStyle } = this.props
        const { values, tabItemWidth,tabItemHeight } = this.state
        return (
            <View style={[styles.mainContainer, { ...tabContainerStyle }]} onLayout={this.onLayoutMainContainer}>
                {values.map((item) => {
                    return <TabItem key={item.index}
                        tabItemWidth={tabItemWidth}
                        tabItemHeight={tabItemHeight}
                        selectedIndex={selectedIndex}
                        item={item}
                        handleOnIndexChange={this.handleOnIndexChange}
                    />
                })}
            </View>
        )
    }

}

const TabItem = ({ selectedIndex, item, handleOnIndexChange, tabItemWidth }) => {
    const itemBackgroundColor = (selectedIndex == item.index) ? "#8977E0" : "transparent"
    const textColor = (selectedIndex == item.index) ? Colors.WHITE : Colors.BLACK
    return (
        <Pressable key={item.index} style={[styles.tabItem, { backgroundColor: itemBackgroundColor, width: tabItemWidth }]} onPress={() => handleOnIndexChange(item.index)}>
            <Text style={[styles.tabItemText, { color: textColor }]}>{item.title}</Text>
        </Pressable>
    )
}


MyActivitySegmentControlTab.defaultProps = {
    onIndexChange: () => { },
    selectedIndex: 0
};


MyActivitySegmentControlTab.propTypes = {
    onIndexChange: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired
};


export default MyActivitySegmentControlTab

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 8,
        backgroundColor: Colors.WHITE,
        alignItems: "center",
        padding:2
    },
    tabItem: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        height:"100%"
    },
    tabItemText: {
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_15,
        textAlign: "center",
    },
})