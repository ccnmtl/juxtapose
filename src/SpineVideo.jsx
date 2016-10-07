import React from 'react';
import {createCollectionList} from './collectionList.js';

export default class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVideo) {
            return <div className="jux-spine-display">
              Add a spine video.
              <button onClick={this.onClick}>&#9998;</button>
            </div>;
        }
        return <div className="jux-spine-display">
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297"
                   onTimeUpdate={this.onTimeUpdate.bind(this)}
                   onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                   onEnded={this.onEnded.bind(this)}>
                <source src={this.props.spineVideo.url + '.mp4'}
                        type="video/mp4" />
                <source src={this.props.spineVideo.url + '.webm'}
                        type="video/webm" />
                <source src={this.props.spineVideo.url + '.ogv'}
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
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
        const vid = this.el;
        vid.play();
    }
    pause() {
        this.el.pause();
    }
    onClick() {
        createCollectionList();
    }
}
