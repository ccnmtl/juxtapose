import React from 'react';
import YouTube from 'react-youtube';
import Vimeo from 'react-vimeo';

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
    renderVimeoVideo(data) {
        return <Vimeo videoId={data.source}
                      className={'vimeo ' + this.className}
                      autoplay={true} />;
    }
    renderYoutubeVideo(data) {
        const opts = {
            height: 225,
            width: 300,
            playerVars: {
                autoplay: 1
            }
        };
        return <YouTube videoId={data.source}
                        opts={opts}
                        ref={(ref) => this.yel = ref} />;
    }
    renderVideo(data) {
        return <video className={this.className}
                      ref={(ref) => this.el = ref}
                      width="297">
            <source src="static/videos/wildspot.mp4" type="video/mp4" />
            <source src="static/videos/wildspot.webm" type="video/webm" />
            <source src="static/videos/wildspot.ogv"
                    type='video/ogg; codecs="theora, vorbis"' />

        </video>;
    }
    renderImage(data) {
        return <img src={data.source} />;
    }
    nowDisplay(data, currentTime) {
        const e = getCurrentItem(data, currentTime);
        if (e && e.type === 'vid') {
            if (this.props.isPlaying) {
                this.play();
            }
            if (e.host === 'youtube') {
                return this.renderYoutubeVideo(e);
            } else if (e.host === 'vimeo') {
                return this.renderVimeoVideo(e);
            }
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
        const el = this.el;
        if (el && el.currentTime) {
            el.currentTime = 5.333;
        }
    }
    play() {
        if (this.el && this.el.paused) {
            this.el.play();
        }
        if (this.yel && this.yel.internalPlayer) {
            this.yel.internalPlayer.playVideo();
        }
    }
    pause() {
        if (this.el && !this.el.paused) {
            this.el.pause();
        }
        if (this.yel && this.yel.internalPlayer) {
            this.yel.internalPlayer.pauseVideo();
        }
    }
    updateVidPosition(time) {
        const e = getCurrentItem(this.props.data, time);
        if (this.el && e && e.type === 'vid') {
            this.el.currentTime = time - e.start_time;
        }
    }
}
