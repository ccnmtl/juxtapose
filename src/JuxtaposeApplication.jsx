import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import _ from 'lodash';
import {extractAssetData, extractVideoData, formatTimecode} from './utils.js';
import {mediaTrackData, textTrackData, collectionData} from './data.js';
import MediaTrack from './MediaTrack.jsx';
import MediaDisplay from './MediaDisplay.jsx';
import TextTrack from './TextTrack.jsx';
import TextDisplay from './TextDisplay.jsx';
import TimelineRuler from './TimelineRuler.jsx';
import TrackElementManager from './TrackElementManager.jsx';
import PlayButton from './PlayButton.jsx';
import Playhead from './Playhead.jsx';
import SpineVideo from './SpineVideo.jsx';
import Xhr from './Xhr.js';


export default class JuxtaposeApplication extends React.Component {
    constructor() {
        super();
        let self = this;
        this.state = {
            spineVideo: null,
            mediaTrack: mediaTrackData,
            textTrack: textTrackData,
            collectionData: collectionData,

            globalAnnotation: '',

            isPlaying: false,
            time: null,
            duration: null,

            // The selected item that's managed in the TrackElementManager.
            activeItem: null
        };

        document.addEventListener('asset.select', function(e) {
            const assetData = extractAssetData(e.detail.annotation);
            const xhr = new Xhr();
            xhr.getAsset(assetData.id)
               .then(function(asset) {
                   const sources = asset.assets[assetData.id].sources;
                   const vid = extractVideoData(sources);

                   // Set the spine video
                   self.setState({
                       'spineVideo': {
                           'url': vid.url,
                           'host': vid.host,
                           'id': assetData.id
                       },
                       'isPlaying': false,
                       'time': 0
                   });
               });
        });

        // Initialize existing SequenceAsset
        if (window.MediaThread && window.MediaThread.current_project) {
            this.initializeSequenceAsset(window.MediaThread.current_project);
        }
    }
    initializeSequenceAsset(currentProject) {
        const self = this;
        const xhr = new Xhr();
        xhr.getSequenceAsset(currentProject)
           .then(function(sequenceAsset) {
               if (sequenceAsset.spine) {
                   xhr.getAsset(sequenceAsset.spine)
                      .then(function(spine) {
                          const sources = spine.assets[sequenceAsset.spine]
                                              .sources;
                          const vid = extractVideoData(sources);
                          self.setState({
                              'spineVideo': {
                                  'url': vid.url,
                                  'host': vid.host,
                                  'id': sequenceAsset.spine
                              },
                              'isPlaying': false,
                              'time': 0
                          });
                      });
               }
           });
    }
    render() {
        const activeItem = this.getItem(this.state.activeItem);
        return <div className="jux-container">
           <textarea className="jux-global-annotation"
                     value={this.state.globalAnnotation}
                     onChange={this.onGlobalAnnotationChange.bind(this)} />
           <div className="vid-container">
                <SpineVideo
                    spineVideo={this.state.spineVideo}
                    ref={(c) => this._spineVid = c}
                    onDuration={this.onSpineDuration.bind(this)}
                    onVideoEnd={this.onSpineVideoEnd.bind(this)}
                    playing={this.state.isPlaying}
                    onProgress={this.onSpineProgress.bind(this)} />
                <MediaDisplay time={this.state.time}
                            data={this.state.mediaTrack}
                            isPlaying={this.state.isPlaying}
                            ref={(c) => this._mediaVid = c} />
            </div>
            <TextDisplay time={this.state.time}
                         duration={this.state.duration} />
            <div className="jux-flex-horiz">
                <PlayButton isPlaying={this.state.isPlaying}
                            onClick={this.onPlayClick.bind(this)} />
                <div className="jux-time">
                    {formatTimecode(this.state.time)} / {formatTimecode(this.state.duration)}
                </div>
            </div>
            <div className="jux-timeline">
                <TimelineRuler duration={this.state.duration} />
                <Playhead currentTime={this.state.time}
                          duration={this.state.duration}
                          onChange={this.onPlayheadTimeChange.bind(this)} />
                <MediaTrack duration={this.state.duration}
                            onDragStop={this.onMediaDragStop.bind(this)}
                            onTrackElementAdd={this.onTrackElementAdd.bind(this)}
                            collectionData={this.state.collectionData}
                            activeItem={this.state.activeItem}
                            data={this.state.mediaTrack} />
                <TextTrack duration={this.state.duration}
                           onDragStop={this.onTextDragStop.bind(this)}
                           onTrackElementAdd={this.onTrackElementAdd.bind(this)}
                           activeItem={this.state.activeItem}
                           data={this.state.textTrack} />
            </div>
            <TrackElementManager
                activeItem={activeItem}
                onSubmit={this.onTrackElementUpdate.bind(this)}
                onDeleteClick={this.onTrackElementRemove.bind(this)} />
            <button className="jux-save-button"
                    onClick={this.onSaveClick.bind(this)}>Save</button>
        </div>;
    }
    /**
     * Update a track item's source value, for TrackElementManager.
     */
    onTrackElementUpdate(activeItem, newData) {
        if (!activeItem) {
            return;
        }

        let track = null;
        if (activeItem.type === 'txt') {
            track = this.state.textTrack;
        } else {
            track = this.state.mediaTrack;
        }

        const item = _.find(track, ['key', activeItem.key, 10]);

        item.source = newData.value;
        item.end_time = item.start_time + newData.duration;

        let newTrack = _.reject(track, ['key', item.key]);
        newTrack.push(item);
        newTrack = _.sortBy(newTrack, 'key');

        if (activeItem.type === 'txt') {
            this.setState({textTrack: newTrack});
        } else {
            this.setState({mediaTrack: newTrack});
        }
    }
    onTrackElementAdd(txt, timestamp) {
        let newTrack = this.state.textTrack.slice();
        newTrack.push({
            key: newTrack.length,
            start_time: 30,
            end_time: 50,
            type: 'txt',
            source: txt
        });
        this.setState({textTrack: newTrack});
    }
    /**
     * This function handles the drag stop event for track items.
     *
     * It returns the new state of the track, which the caller can save
     * with setState.
     */
    trackItemDragHandler(origTrack, item) {
        const track = _.find(origTrack, ['key', parseInt(item['i'], 10)]);
        const percent = (item.x / 1000);
        const len = track.end_time - track.start_time;
        track.start_time = percent * this.state.duration;
        track.end_time = track.start_time + len;

        // TODO: can this be simplified?
        let newTrack = _.reject(origTrack, ['key', track.key]);
        newTrack.push(track);
        newTrack = _.sortBy(newTrack, 'key');
        return newTrack;
    }
    onMediaDragStop(items, event, item) {
        const newTrack = this.trackItemDragHandler(this.state.mediaTrack, item);
        this.setState({
            activeItem: ['media', item.i],
            mediaTrack: newTrack
        });
    }
    onTextDragStop(items, event, item) {
        const newTrack = this.trackItemDragHandler(this.state.textTrack, item);
        this.setState({
            activeItem: ['txt', item.i],
            textTrack: newTrack
        });
    }
    onPlayClick(e) {
        const newState = !this.state.isPlaying;
        this.setState({isPlaying: newState})

        // TODO: this should be more declarative, handled by the
        // video components.
        if (newState) {
            this._mediaVid.play();
        } else {
            this._mediaVid.pause();
        }
    }
    /**
     * Remove the active track item.
     */
    onTrackElementRemove() {
        if (!this.state.activeItem) {
            return;
        }

        const track = this.state.activeItem[0];
        const i = this.state.activeItem[1];

        if (track === 'txt') {
            let newTrack = this.state.textTrack.slice();
            newTrack.splice(i, 1);
            this.setState({
                textTrack: newTrack,
                activeItem: null
            });
        } else {
            let newTrack = this.state.mediaTrack.slice();
            newTrack.splice(i, 1);
            this.setState({
                mediaTrack: newTrack,
                activeItem: null
            });
        }
    }
    onPlayheadTimeChange(e) {
        const percentDone = e.target.value / 1000;
        const newTime = this.state.duration * percentDone;
        this.setState({time: newTime});
        this._spineVid.updateVidPosition(percentDone);
        this._mediaVid.updateVidPosition(newTime);
    }
    onSpineVideoEnd() {
        this.setState({isPlaying: false});
    }
    onGlobalAnnotationChange(e) {
        this.setState({globalAnnotation: e.target.value});
    }
    onSpineDuration(duration) {
        this.setState({duration: duration});
    }
    onSpineProgress(state) {
        if (typeof state.played !== 'undefined') {
            this.setState({
                time: state.played * 100
            });
        }
    }
    onSaveClick() {
        const xhr = new Xhr();
        xhr.createOrUpdateSequenceAsset(
            this.state.spineVideo.id,
            window.MediaThread.current_course,
            window.MediaThread.current_project,
            this.state.mediaTrack,
            this.state.textTrack);
    }
    /**
     * Get the item in textTrack or mediaTrack, based on the activeItem
     * format: [track type, index]
     */
    getItem(a) {
        if (!a) {
            return null;
        }

        if (a[0] === 'txt') {
            return this.state.textTrack[a[1]];
        } else {
            return this.state.mediaTrack[a[1]];
        }
    }
}
