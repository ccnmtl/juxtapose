import React from 'react';
import ReactPlayer from 'react-player';


/**
 * Each video/audio element has its own SecondaryPlayer instance
 * that's always rendered on the page, and displayed when the
 * sequence's time is at the right position.
 */
export default class SecondaryPlayer extends React.Component {
    render() {
        let url = null;
        if (this.props.data.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' + this.props.data.source;
        } else if (this.props.data.host === 'vimeo') {
            url = 'https://www.vimeo.com/watch?v=' + this.props.data.source;
        } else {
            url = this.props.data.source;
        }

        const volume = (this.props.hidden) ? 0 : 0.8;
        return <ReactPlayer
            ref={(ref) => this.player = ref}
            width={480}
            height={360}
            url={url}
            volume={volume}
            hidden={this.props.hidden}
            playing={this.props.playing}
        />;
    }
}
