import React from 'react';

export default class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
    }
    render() {
        return <div className="jux-spine-display">
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297"
                   onTimeUpdate={this.onTimeUpdate.bind(this)}
                   onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                   onEnded={this.onEnded.bind(this)}>
                <source src="videos/triangle.mp4" type="video/mp4" />
                <source src="videos/triangle.webm" type="video/webm" />
                <source src="videos/triangle.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
            <button>&#9998;</button>
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
    }
    // TODO: handle playback finish event
    play() {
        const vid = this.el;
        vid.play();
    }
    pause() {
        this.el.pause();
    }
}
