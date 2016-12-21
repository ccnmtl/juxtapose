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
              <p className="instructions">{this.props.instructions}</p>
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
                    onPlay={this.props.onPlay}
                    onPause={this.props.onPause}
                    progressFrequency={100}
                    youtubeConfig={youtubeConfig}
                />
                {editButton}
        </div>;
    }
    updateVidPosition(fraction) {
        this.player.seekTo(fraction);
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
        let caller = {
            'type': 'spine',
            'timecode': 0
        };
        createCollectionWidget('video', caller);
    }
}
