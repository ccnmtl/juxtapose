import React from 'react';
import ReactPlayer from 'react-player';
import BasePlayer from './BasePlayer.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';
import {editAnnotationWidget} from './mediathreadCollection.js';
import {decodeQuotes} from './utils.js';

export default class SpineDisplay extends BasePlayer {
    constructor(props) {
        super(props);
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVid) {
            const instructions = decodeQuotes(this.props.instructions);
            return <div className="jux-spine-display">
              <div className="help-text">
              <button className="add-spine" onClick={this.onClickReviseSpine}>
                      <svg width="2em" height="2em" viewBox="0 0 16 16"
                        className="bi bi-plus-circle-fill" fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z"/>
                      </svg>
              </button>
              <h2 onClick={this.onClickReviseSpine}>Add a primary video</h2>
              <p className="instructions">{instructions}</p>
              </div>
            </div>;
        }

        let url = null;
        if (this.props.spineVid.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' +
                  this.props.spineVid.url;
        } else {
            url = this.props.spineVid.url;
        }

        let spineVolume = 80;
        if (this.props.spineVid) {
            spineVolume = this.props.spineVid.volume;
        }

        let spineControls = '';
        if (!this.props.readOnly) {
            let volumeIcon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-volume-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04L4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04z"/>
                              <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                              <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                              <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707z"/>
                            </svg>;
            if (spineVolume === 0) {
                volumeIcon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-volume-off" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10.717 3.55A.5.5 0 0 1 11 4v8a.5.5 0 0 1-.812.39L7.825 10.5H5.5A.5.5 0 0 1 5 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM10 5.04L8.312 6.39A.5.5 0 0 1 8 6.5H6v3h2a.5.5 0 0 1 .312.11L10 10.96V5.04z"/>
                            </svg>;
            } else if (spineVolume <= 50) {
                volumeIcon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-volume-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM8 5.04L6.312 6.39A.5.5 0 0 1 6 6.5H4v3h2a.5.5 0 0 1 .312.11L8 10.96V5.04z"/>
                              <path d="M10.707 11.182A4.486 4.486 0 0 0 12.025 8a4.486 4.486 0 0 0-1.318-3.182L10 5.525A3.489 3.489 0 0 1 11.025 8c0 .966-.392 1.841-1.025 2.475l.707.707z"/>
                            </svg>;
            }
            spineControls =
                <div className="jux-spine-controls">
                    <button className="btn btn-default jux-spine-revise"
                            title="Revise primary video"
                            onClick={this.onClickReviseSpine}>

                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
                                <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
                            </svg>

                    </button>
                    <button className="btn btn-default jux-spine-edit"
                            title="Edit primary video"
                            onClick={this.onClickEditSpine.bind(this)}>

                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
                                <path fillRule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
                            </svg>

                    </button>
                    <button className="btn btn-default jux-spine-vol-display"
                            title="Toggle volume"
                            onClick={this.onVolumeToggle.bind(this)}>
                        {volumeIcon}
                    </button>
                    <input type="range" min="0" max="100"
                           className="jux-spine-vol-input"
                           value={spineVolume}
                           onChange={this.onVolumeChange.bind(this)} />
                </div>;
        }

        const volume = this.props.spineVid.volume / 100;

        return <div className="jux-spine-display">
                <ReactPlayer
                    id={this.id}
                    ref={(c) => this.player = c}
                    width={480}
                    height={360}
                    volume={volume}
                    playing={this.props.playing}
                    onEnded={this.props.onEnded}
                    url={url}
                    onStart={this.onStart.bind(this)}
                    onDuration={this.props.onDuration}
                    onProgress={this.props.onProgress}
                    onPlay={this.props.onPlay}
                    onPause={this.props.onPause}
                    youtubeConfig={this.youtubeConfig}
                    vimeoConfig={this.vimeoConfig}
                />
                {spineControls}
        </div>;
    }
    onStart() {
        if (this.props.spineVid.annotationStartTime && this.props.duration) {
            const percentage = this.props.spineVid.annotationStartTime /
                this.props.duration;
            this.player.seekTo(percentage);
        }
    }
    onClickReviseSpine() {
        let caller = {
            'type': 'spine',
            'timecode': 0
        };
        createCollectionWidget('video', true, caller);
    }
    onClickEditSpine() {
        let caller = {
            'type': 'spine',
        };
        editAnnotationWidget(
            this.props.spineVid.assetId,
            this.props.spineVid.annotationId,
            this.props.spineVid.annotationDuration === undefined,
            caller);
    }
    onVolumeChange(e) {
        const volume = parseInt(e.target.value, 10);
        this.props.onVolumeChange(volume);
    }
    onVolumeToggle() {
        this.props.onVolumeToggle();
    }
}
