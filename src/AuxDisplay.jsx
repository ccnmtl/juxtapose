import React from 'react';
import YouTube from 'react-youtube';


export default class AuxDisplay extends React.Component {
    constructor() {
        super()
        this.id = 'jux-aux-video';
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
        return <video id={this.id}
                      ref={(ref) => this.el = ref}
                      width="297">
            <source src="videos/wildspot.mp4" type="video/mp4" />
            <source src="videos/wildspot.webm" type="video/webm" />
            <source src="videos/wildspot.ogv"
                    type='video/ogg; codecs="theora, vorbis"' />

        </video>;
    }
    renderImage(data) {
        return <img src={data.source} />;
    }
    nowDisplay(data, currentTime) {
        for (let e of data) {
            if (currentTime >= e.startTime &&
                currentTime <= e.endTime) {
                if (e.type === 'vid') {
                    if (this.props.isPlaying) {
                        this.play();
                    }
                    if (e.host === 'youtube') {
                        return this.renderYoutubeVideo(e);
                    }
                    return this.renderVideo(e);
                } else {
                    return this.renderImage(e);
                }
            }
        }
        return '';
    }
    render() {
        let c = this.nowDisplay(this.props.data, this.props.time);
        return <div className="jux-aux-display">{c}</div>;
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
}
