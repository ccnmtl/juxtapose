import React from 'react';
import ReactPlayer from 'react-player';


/**
 * Each video/audio element has its own MediaPlayer instance
 * that's always rendered on the page, and displayed when the
 * sequence's time is at the right position.
 */
export default class AVPlayer extends React.Component {
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

        // Start playing a few seconds before so everything is loaded in
        // time.
        const diff = this.props.data.start_time - this.props.time;
        const isAboutToPlay = diff > 0 && diff < 2;
        const playing = isAboutToPlay ||
                        (!this.props.hidden && this.props.playing);

        const youtubeConfig = {
            playerVars: {
                // Disable fullscreen
                fs: 0,
                // Disable keyboard controls
                disablekb: 1,
                // Hide video annotations
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            }
        };
        const vimeoConfig = {
            iframeParams: {
                autopause: 0,
                badge: 0,
                byline: 0,
                fullscreen: 0,
                portrait: 0,
                title: 0
            }
        };

        return <ReactPlayer
                   ref={(ref) => this.player = ref}
                   width={480}
                   height={360}
                   url={url}
                   volume={volume}
                   hidden={this.props.hidden}
                   onDuration={this.onDuration.bind(this)}
                   onStart={this.onStart.bind(this)}
                   playing={playing}
                   youtubeConfig={youtubeConfig}
                   vimeoConfig={vimeoConfig}
               />;
    }
    onDuration(duration) {
        this.setState({duration: duration});
    }
    onStart() {
        const vid = this.props.data;
        if (vid.annotationStartTime && this.state.duration) {
            const percentage = vid.annotationStartTime / this.state.duration;
            this.player.seekTo(percentage);
        }
    }
    seekTo(percentage) {
        if (!this.player) {
            return;
        }

        const time = this.props.sequenceDuration * percentage;
        const e = this.props.data;
        const newPercentage = (
            time - e.start_time + (e.annotationStartTime || 0)
        ) / this.state.duration;
        if (newPercentage >= 0 && newPercentage <= 100) {
            this.player.seekTo(newPercentage);
        }
    }
}
