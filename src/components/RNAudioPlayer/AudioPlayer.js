import React,{Component} from 'react'
import PropTypes from 'prop-types'
import VideoPlayer from "../RNVideoPlayer/";

import Images from '../../assets/images/'

class AudioPlayer extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const {url,audioProps} = this.props
        return (
            <VideoPlayer
                audioOnly={true}
                url = {url}
                lockRatio={16 / 9}
                hideFullScreenControl = {true}
                inlineOnly={true}
                videoProps = {{...audioProps}}
            />
        )
    }
}

AudioPlayer.defaultProps = {
    url : "",
}

AudioPlayer.propTypes = {
    url : PropTypes.string.isRequired,
}




export default AudioPlayer