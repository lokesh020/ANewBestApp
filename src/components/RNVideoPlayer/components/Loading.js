import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

class Loading extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color={"tomato"}/>
        </View>
      )
    }
    return null
  }
}

Loading.propTypes = {
  loading: PropTypes.bool
}

Loading.defaultProps = {
  loading: true
}

export default Loading 
