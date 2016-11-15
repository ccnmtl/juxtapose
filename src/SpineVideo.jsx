import React from 'react';
import ReactPlayer from 'react-player'
import {createCollectionWidget} from './mediathreadCollection.js';

export default class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVideo) {
            return <div className="jux-spine-display">
              <button onClick={this.onClick}>Add a spine video</button>
            </div>;
        }

        let url = null;
        if (this.props.spineVideo.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' +
                  this.props.spineVideo.url;
        } else if (this.props.spineVideo.host === 'vimeo') {
            url = 'https://www.vimeo.com/watch?v=' + this.props.spineVideo.url;
        } else {
            url = this.props.spineVideo.url;
        }

        return <div className="jux-spine-display">
                <ReactPlayer
                    id={this.id}
                    ref={(ref) => this.player = ref}
                    width={297}
                    height={222.25}
                    playing={this.props.playing}
                    onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                    onEnded={this.onEnded.bind(this)}
                    url={url}
                    onDuration={this.props.onDuration}
                    onProgress={this.props.onProgress}
                    progressFrequency={100}
                />
            <button onClick={this.onClick}>&#9998;</button>
        </div>;
    }
    updateVidPosition(percent) {
        console.log(this.player, percent);
        this.player.seekTo(percent);
    }
    onLoadedMetadata(e) {
        const vid = e.target;
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    onEnded(e) {
        this.props.onVideoEnd();
    }
    // TODO: handle playback finish event
    onClick() {
        createCollectionWidget('video');
    }
}
