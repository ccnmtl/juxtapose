import React from 'react';
import ReactPlayer from 'react-player';


/**
 * Each video/audio element has its own SecondaryPlayer instance
 * that's always rendered on the page, and displayed when the
 * sequence's time is at the right position.
 */
export default class SecondaryPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {duration: null};
    }
    render() {
        let url = this.props.data.source;
        if (this.props.data.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' + this.props.data.source;
        }

        const volume = (this.props.hidden) ? 0 : 0.8;
        const playing = !this.props.hidden && this.props.playing;
        return <ReactPlayer
            ref={(ref) => this.player = ref}
            width={480}
            height={360}
            url={url}
            volume={volume}
            hidden={this.props.hidden}
            onDuration={this.onDuration.bind(this)}
            playing={playing}
        />;
    }
    onDuration(duration) {
        this.setState({duration: duration});
    }
}
