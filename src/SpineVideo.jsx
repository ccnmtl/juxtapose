import React from 'react';
import YouTube from 'react-youtube';
import Vimeo from 'react-vimeo';
import {createCollectionWidget} from './mediathreadCollection.js';

export default class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
    }
    renderMp4Video(url) {
        return <video id={this.id}
                      ref={(ref) => this.el = ref}
                      width="297"
                      onTimeUpdate={this.onTimeUpdate.bind(this)}
                      onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                      onEnded={this.onEnded.bind(this)}>
            <source src={url} type="video/mp4" />
        </video>;
    }
    renderYoutubeVideo(id) {
        const opts = {
            height: 225,
            width: 300,
            playerVars: {
                autoplay: 0,
                controls: 0
            }
        };
        return <YouTube videoId={id}
                        opts={opts}
                        ref={(ref) => this.yel = ref}
                        onReady={this.props.onYTReady} />;
    }
    renderVimeoVideo(id) {
        return <Vimeo videoId={id}
                      className={'vimeo ' + this.className}
                      autoplay={false} />;
    }
    render() {
        if (!this.props.spineVideo) {
            return <div className="jux-spine-display">
              Add a spine video.
              <button onClick={this.onClick}>&#9998;</button>
            </div>;
        }
        let video = null;

        if (this.props.spineVideo.host === 'youtube') {
            video = this.renderYoutubeVideo(this.props.spineVideo.url);
        } else if (this.props.spineVideo.host === 'vimeo') {
            video = this.renderVimeoVideo(this.props.spineVideo.url);
        } else {
            video = this.renderMp4Video(this.props.spineVideo.url);
        }
        return <div className="jux-spine-display">
            {video}
            <button onClick={this.onClick}>&#9998;</button>
        </div>;
    }
    updateVidPosition(time) {
        this.el.currentTime = time;
    }
    onLoadedMetadata(e) {
        const vid = e.target;
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    onTimeUpdate(e) {
        const vid = e.target;
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    onEnded(e) {
        this.props.onVideoEnd();
    }
    // TODO: handle playback finish event
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
    onClick() {
        createCollectionWidget('video');
    }
}
