import React from 'react';

export default class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
        this.state = {duration: null, time: null};
    }
    render() {
        return <div className="jux-spine-display">
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297"
                   onTimeUpdate={this.handleTimeUpdate.bind(this)}
                   onLoadedMetadata={this.handleLoadedMetadata.bind(this)}>
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
    handleLoadedMetadata(e) {
        const vid = e.target;
        this.setState({time: vid.currentTime, duration: vid.duration});
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    handleTimeUpdate(e) {
        const vid = e.target;
        this.setState({time: vid.currentTime});
        this.props.callbackParent(vid.currentTime, this.state.duration);
    }
    // TODO: handle playback finish event
    play() {
        const vid = this.el;
        this.setState({time: vid.currentTime, duration: vid.duration});
        vid.play();
    }
    pause() {
        this.el.pause();
    }
}
