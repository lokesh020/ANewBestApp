import React from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native'

import Slider from "../../Slider";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  slider: {
    marginHorizontal: -10
  },
  thumbStyle: {
    width: 15,
    height: 15
  },
  trackStyle: {
    borderRadius: 1
  }
})

const Scrubber = (props) => {
  const trackColor = 'rgba(255,255,255,0.5)'
  const { progress, theme, onSeek, onSeekRelease } = props
  return (
    <View style={styles.container}>
      <Slider
          style={styles.slider}
          onValueChange={val => onSeek(val)}
          onSlidingComplete={val => onSeekRelease(val)}
          value={progress}
          thumbTintColor={theme.scrubberThumb}
          minimumTrackTintColor={theme.scrubberBar}
          maximumTrackTintColor={trackColor}
        />
    </View>
  )
}

Scrubber.propTypes = {
  onSeek: PropTypes.func.isRequired,
  onSeekRelease: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

export default Scrubber 
