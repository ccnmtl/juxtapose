import React from 'react';
import ReactPlayer from 'react-player'

/**
 * Derive the currently playing item given the current time
 * and the track state.
 */
export function getCurrentItem(data, currentTime) {
    for (let e of data) {
        if (currentTime >= e.start_time && currentTime <= e.end_time) {
            return e;
        }
    }
    return null;
}


export default class MediaDisplay extends React.Component {
    constructor() {
        super()
        this.className = 'jux-media-video';
    }
    renderVideo(data) {
        let url = null;
        if (data.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' + data.source;
        } else if (data.host === 'vimeo') {
            url = 'https://www.vimeo.com/watch?v=' + data.source;
        } else {
            url = data.source;
        }

        return <ReactPlayer
            id={this.id}
            ref={(ref) => this.player = ref}
            width={480}
            height={360}
            playing={this.props.isPlaying}
            url={url}
            onDuration={this.props.onDuration}
            onProgress={this.props.onProgress}
            progressFrequency={100}
        />;
    }
    renderImage(data) {
        return <img src={data.source} />;
    }
    nowDisplay(data, currentTime) {
        const e = getCurrentItem(data, currentTime);
        if (e && e.type === 'vid') {
            return this.renderVideo(e);
        } else if (e && e.type === 'img') {
            return this.renderImage(e);
        }
        return '';
    }
    render() {
        let c = this.nowDisplay(this.props.data, this.props.time);
        return <div className="jux-media-display">{c}</div>;
    }
    componentDidMount() {
        const el = this.player;
        if (el && el.currentTime) {
            el.currentTime = 5.333;
        }
    }
    play() {
        if (this.player && this.player.paused) {
            this.player.play();
        }
    }
    pause() {
        if (this.player && !this.player.paused) {
            this.player.pause();
        }
    }
    updateVidPosition(time) {
        const e = getCurrentItem(this.props.data, time);
        if (this.player && e && e.type === 'vid') {
            this.player.currentTime = time - e.start_time;
        }
    }
}
