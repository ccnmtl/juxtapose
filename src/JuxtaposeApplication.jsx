import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import _ from 'lodash';
import {
    collisionPresent, extractAssetData, extractSource, extractAnnotation,
    formatTimecode, loadMediaData, loadTextData
} from './utils.js';
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
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            spineVideo: null,
            mediaTrack: [],
            textTrack: [],

            globalAnnotation: '',

            isPlaying: false,
            time: null,
            duration: null,

            // The selected item that's managed in the TrackElementManager.
            activeItem: null
        };

        document.addEventListener('asset.select', function(e) {
            // This event will either set the spine video, or
            // trigger the insertion of a media element, depending
            // on what the user is doing.
            const assetData = extractAssetData(e.detail.annotation);
            const xhr = new Xhr();
            xhr.getAsset(assetData.id)
               .then(function(asset) {
                   const assetCtx = asset.assets[assetData.id];
                   const source = extractSource(assetCtx.sources);
                   const annotation = extractAnnotation(assetCtx, assetData.annotationId);
                   
                   if (e.detail.caller.type === 'spine') {
                       // Set the spine video
                       self.setState({
                           spineVideo: {
                               url: source.url,
                               host: source.host,
                               id: assetData.id,
                               annotationId: assetData.annotationId,
                               annotationStartTime: annotation.startTime,
                               annotationDuration: annotation.duration
                           },
                           isPlaying: false,
                           time: 0
                       });
                   } else {
                       let newTrack = self.state.mediaTrack.slice(0);
                       if (assetCtx.primary_type === 'image') {
                           newTrack.push({
                               key: newTrack.length,
                               start_time: e.detail.caller.timecode,
                               end_time: e.detail.caller.timecode + annotation.duration,
                               type: 'img',
                               host: source.host,
                               source: source.url,
                               id: assetData.id,
                               annotationId: assetData.annotationId,
                               annotationData: annotation.annotationData
                           });
                       } else {
                           newTrack.push({
                               key: newTrack.length,
                               start_time: e.detail.caller.timecode,
                               end_time: e.detail.caller.timecode + annotation.duration,
                               annotationStartTime: annotation.startTime,
                               annotationDuration: annotation.duration,
                               type: 'vid',
                               host: source.host,
                               source: source.url,
                               id: assetData.id,
                               annotationId: assetData.annotationId
                           });
                       }

                       self.setState({
                           mediaTrack: newTrack
                       });
                   }
                   jQuery(window).trigger('sequenceassignment.set_dirty',
                                          {dirty: true});
               });
        });

        document.addEventListener('sequenceassignment.save', function(e) {
            self.onSaveClick();
        });

        document.addEventListener('asset.save', function(e) {
            if (e.detail.caller.type === 'spine') {
                let state = _.extend({}, self.state);
                state.spineVideo.annotationStartTime = e.detail.startTime;
                state.spineVideo.annotationDuration = e.detail.duration;
                self.setState(state);
            } else {
               // TODO Find the TrackElement & update start & duration
            }
        });
    }
    componentDidMount() {
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
               if (!sequenceAsset) {
                   return;
               }

               // Fetch each media element's actual media from Mediathread.
               sequenceAsset.media_elements.forEach(function(e) {
                   xhr.getAsset(e.media).then(function(asset) {
                       const sources = asset.assets[e.media].sources;
                       const source = extractSource(sources);
                       e.source = source.url;
                       if (asset.assets[e.media].primary_type === 'image') {
                           e.type = 'img';
                       } else {
                           e.type = 'vid';
                       }
                   });
               });
               self.setState({
                   mediaTrack: loadMediaData(sequenceAsset.media_elements),
                   textTrack: loadTextData(sequenceAsset.text_elements)
               });

               let promises = [];
               if (sequenceAsset.spine) {
                   promises.push(
                       xhr.getAsset(sequenceAsset.spine)
                          .then(function(spine) {
                              const sources =
                                  spine.assets[sequenceAsset.spine].sources;
                              const vid = extractSource(sources);
                              self.setState({
                                  spineVideo: {
                                      url: vid.url,
                                      host: vid.host,
                                      id: sequenceAsset.spine
                                  },
                                  isPlaying: false,
                                  time: 0
                              });
                          }));
               }

               return Promise.all(promises);
           }).then(function() {
               jQuery(window).trigger('sequenceassignment.set_submittable', {
                   submittable: self.isBaselineWorkCompleted()
               });
           });
    }
    render() {
        const activeItem = this.getItem(this.state.activeItem);
        let tracks = '';
        if (!this.props.readOnly) {
            tracks = <span>
    <MediaTrack
        duration={this.state.duration}
        onDragStop={this.onMediaDragStop.bind(this)}
        onTrackEditButtonClick={this.onMediaTrackEditButtonClick.bind(this)}
        activeItem={this.state.activeItem}
        data={this.state.mediaTrack} />
    <TextTrack
        duration={this.state.duration}
        onDragStop={this.onTextDragStop.bind(this)}
        onTrackElementAdd={this.onTextTrackElementAdd.bind(this)}
        onTrackEditButtonClick={this.onTextTrackEditButtonClick.bind(this)}
        activeItem={this.state.activeItem}
        data={this.state.textTrack} />
            </span>;
        }

        return <div className="jux-container">
           <textarea className="jux-global-annotation"
                     value={this.state.globalAnnotation}
                     onChange={this.onGlobalAnnotationChange.bind(this)} />
           <div className="vid-container">
                <SpineVideo
                    spineVideo={this.state.spineVideo}
                    ref={(c) => this._primaryVid = c}
                    readOnly={this.props.readOnly}
                    onDuration={this.onSpineDuration.bind(this)}
                    onVideoEnd={this.onSpineVideoEnd.bind(this)}
                    playing={this.state.isPlaying}
                    onProgress={this.onSpineProgress.bind(this)}
                    onPlay={this.onSpinePlay.bind(this)}
                    onPause={this.onSpinePause.bind(this)}
                    instructions={this.props.primaryInstructions}
                />
                <MediaDisplay
                    time={this.state.time}
                    duration={this.state.duration}
                    data={this.state.mediaTrack}
                    ref={(c) => this._secondaryVid = c}
                    playing={this.state.isPlaying}
                    instructions={this.props.secondaryInstructions}
                />
            </div>
            <TextDisplay time={this.state.time}
                         duration={this.state.duration}
                         data={this.state.textTrack} />
            <PlayButton isPlaying={this.state.isPlaying}
                        onClick={this.onPlayClick.bind(this)} />
            <div className="jux-flex-horiz">
                <div className="jux-time">
                    {formatTimecode(this.state.time)} / {formatTimecode(this.state.duration)}
                </div>
            </div>
            <div className="jux-timeline">
                <TimelineRuler duration={this.state.duration} />
                <Playhead currentTime={this.state.time}
                          duration={this.state.duration}
                          onMouseUp={this.onPlayheadMouseUp.bind(this)}
                          onChange={this.onPlayheadTimeChange.bind(this)} />
                {tracks}
            </div>
            <TrackElementManager
                activeItem={activeItem}
                onChange={this.onTrackElementUpdate.bind(this)}
                onDeleteClick={this.onTrackElementRemove.bind(this)} />
        </div>;
    }
    isBaselineWorkCompleted() {
        return !!this.state.spineVideo &&
               (this.state.mediaTrack.length > 0 ||
                this.state.textTrack.length > 0);
    }
    /**
     * Update a track item, for TrackElementManager.
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
        let newTrack = _.reject(track, ['key', item.key]);

        // If there's a collision present given the new start_time and
        // end_time, cancel this action.
        if (
            collisionPresent(
                newTrack,
                this.state.duration,
                newData.start_time || item.start_time,
                newData.end_time || item.end_time)
        ) {
            return;
        }

        if (newData.source) {
            item.source = newData.source;
        }
        if (newData.start_time) {
            item.start_time = newData.start_time;
        }
        if (newData.end_time) {
            item.end_time = newData.end_time;
        }

        newTrack.push(item);
        newTrack = _.sortBy(newTrack, 'key');

        if (activeItem.type === 'txt') {
            this.setState({textTrack: newTrack});
        } else {
            this.setState({mediaTrack: newTrack});
        }

        jQuery(window).trigger('sequenceassignment.set_dirty',
                               {dirty: true});
    }
    onTextTrackElementAdd(txt, timecode) {
        let newTrack = this.state.textTrack.slice();
        newTrack.push({
            key: newTrack.length,
            start_time: timecode,
            end_time: timecode + 30,
            type: 'txt',
            source: txt
        });
        this.setState({textTrack: newTrack});
        jQuery(window).trigger('sequenceassignment.set_dirty',
                               {dirty: true});
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
    onMediaTrackEditButtonClick(event, item) {
        this.setState({activeItem: ['media', item.props.data.key]});
    }
    onTextTrackEditButtonClick(event, item) {
        this.setState({activeItem: ['txt', item.props.data.key]});
    }
    onMediaDragStop(items, event, item) {
        const newTrack = this.trackItemDragHandler(this.state.mediaTrack, item);
        this.setState({mediaTrack: newTrack});
        jQuery(window).trigger('sequenceassignment.set_dirty',
                               {dirty: true});
    }
    onTextDragStop(items, event, item) {
        const newTrack = this.trackItemDragHandler(this.state.textTrack, item);
        this.setState({textTrack: newTrack});
        jQuery(window).trigger('sequenceassignment.set_dirty',
                               {dirty: true});
    }
    onPlayClick(e) {
        const newState = !this.state.isPlaying;
        this.setState({isPlaying: newState})
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
    }
    onPlayheadMouseUp() {
        const percentage = this.state.time / this.state.duration;
        this._primaryVid.updateVidPosition(percentage);
        this._secondaryVid.updateVidPosition(percentage);
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
            const seconds = this.state.duration * state.played;
            this.setState({time: seconds});
        }
    }
    onSpinePlay() {
        if (!this.state.isPlaying) {
            this.setState({isPlaying: true});
        }
    }
    onSpinePause() {
        if (this.state.isPlaying) {
            this.setState({isPlaying: false});
        }
    }
    onSaveClick() {
        const xhr = new Xhr();
        const self = this;
        xhr.createOrUpdateSequenceAsset(
            this.state.spineVideo.id,
            window.MediaThread.current_course,
            window.MediaThread.current_project,
            this.state.mediaTrack,
            this.state.textTrack
        ).then(function(e) {
            jQuery(window).trigger(
                'sequenceassignment.on_save_success', {
                    submittable: self.isBaselineWorkCompleted()
                });
        }).catch(function(e) {
            // Open Mediathread's error popup
            jQuery(window).trigger('sequenceassignment.on_save_error', e);
        });
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
