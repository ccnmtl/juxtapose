import React from 'react';
import ReactPlayer from 'react-player'
import {createCollectionWidget} from './mediathreadCollection.js';

export default class SpineVideo extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVideo) {
            return <div className="jux-spine-display">
              <div className="help-text">
              <button className="add-spine" onClick={this.onClick}></button>
              <h1>Add a primary video</h1>
              </div>
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

        let editButton = '';
        if (!this.props.readOnly) {
            editButton = <button className="btn btn-default jux-spine-revise"
                                 onClick={this.onClick}>
                <span className="glyphicon glyphicon-pencil"
                      aria-hidden="true"></span>
            </button>;
        }

        return <div className="jux-spine-display">
                <ReactPlayer
                    id={this.id}
                    ref={(ref) => this.player = ref}
                    width={480}
                    height={360}
                    playing={this.props.playing}
                    onLoadedMetadata={this.onLoadedMetadata.bind(this)}
                    onEnded={this.onEnded.bind(this)}
                    url={url}
                    onDuration={this.props.onDuration}
                    onProgress={this.props.onProgress}
                    progressFrequency={100}
                />
                {editButton}
        </div>;
    }
    updateVidPosition(percent) {
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
        createCollectionWidget('video', 'spine');
    }
}
