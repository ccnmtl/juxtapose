import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import _ from 'lodash';
import {
    collisionPresent, constrainEndTimeToAvailableSpace,
    getElement,
    hasOutOfBoundsElement, removeOutOfBoundsElements,
    parseAsset, formatTimecode, loadMediaData, loadTextData
} from './utils.js';
import {editAnnotationWidget} from './mediathreadCollection.js';
import {defineTimecodeSpinner} from './timecodeSpinner.js';
import MediaTrack from './MediaTrack.jsx';
import MediaDisplay from './MediaDisplay.jsx';
import OutOfBoundsModal from './OutOfBoundsModal.jsx';
import TextTrack from './TextTrack.jsx';
import TextDisplay from './TextDisplay.jsx';
import TimelineRuler from './TimelineRuler.jsx';
import TrackElementManager from './TrackElementManager.jsx';
import PlayButton from './PlayButton.jsx';
import Playhead from './Playhead.jsx';
import SpineDisplay from './SpineDisplay.jsx';
import Xhr from './Xhr.js';


export default class JuxtaposeApplication extends React.Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            spineVid: null,
            mediaTrack: [],
            textTrack: [],

            playing: false,
            time: null,
            duration: null,

            // The selected item that's managed in the TrackElementManager.
            // TODO: rename this to activeElement
            activeItem: null,

            // The currently displaying secondary element
            currentSecondaryElement: null,

            showOutOfBoundsModal: false
        };

        document.addEventListener('asset.select', function(e) {
            // This event will either set the spine video, or
            // trigger the insertion of a media element, depending
            // on what the user is doing.
            if (e.detail.caller.type === 'spine') {
                self.addOrEditSpineVideo(
                    e.detail.assetId, e.detail.annotationId);
            } else {
                self.addMediaTrackElement(
                    e.detail.assetId, e.detail.annotationId,
                    e.detail.caller.timecode);
            }
            jQuery(window).trigger('sequenceassignment.set_dirty',
                                   {dirty: true});
        });

        document.addEventListener('asset.save', function(e) {
            if (e.detail.caller.type === 'spine') {
                self.addOrEditSpineVideo(e.detail.assetId,
                                         e.detail.annotationId);
            } else {
                self.editActiveMediaTrackElement(e.detail.assetId,
                                                 e.detail.annotationId);
            }
        });

        document.addEventListener('sequenceassignment.save', function(e) {
            self.onSaveClick();
        });

        defineTimecodeSpinner();
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
               if (!sequenceAsset || !sequenceAsset.spine) {
                   return;
               }

               // Fetch each media element's actual media from Mediathread.
               sequenceAsset.media_elements.forEach(function(e) {
                   xhr.getAsset(e.media_asset).then(function(json) {
                       const ctx = parseAsset(json, e.media_asset, e.media);
                       e.host = ctx.host;
                       e.source = ctx.url;
                       e.type = ctx.type;
                       e.annotationStartTime = ctx.startTime;
                       e.annotationDuration = ctx.duration;
                       e.annotationData = ctx.data;
                   });
               });
               self.setState({
                   mediaTrack: loadMediaData(sequenceAsset.media_elements),
                   textTrack: loadTextData(sequenceAsset.text_elements)
               });

               return xhr
                   .getAsset(sequenceAsset.spine_asset)
                   .then(function(json) {
                       const ctx = parseAsset(
                           json,
                           sequenceAsset.spine_asset,
                           sequenceAsset.spine);

                       self.updateSpineVid(
                           ctx.url, ctx.host, sequenceAsset.spine_asset,
                           sequenceAsset.spine,
                           ctx.startTime, ctx.duration);
                   })
                   .catch(function(error) {
                       console.error('Sequence loading error:', error);
                   });
           }).then(function() {
               jQuery(window).trigger('sequenceassignment.set_submittable', {
                   submittable: self.isBaselineWorkCompleted()
               });
               jQuery('#sequence>.loader').hide();
               jQuery('#jux-container').fadeTo('fast', 1);
           }).catch(function() {
               jQuery('#sequence>.loader').hide();
               jQuery('#jux-container').fadeTo('fast', 1);
           });
    }
    render() {
        const activeItem = this.getItem(this.state.activeItem);
        let tracks = '';
        if (!this.props.readOnly) {
            tracks = <span>
    <MediaTrack
        duration={this.sequenceDuration()}
        onDragStop={this.onMediaDragStop.bind(this)}
        onTrackEditButtonClick={this.onMediaTrackEditButtonClick.bind(this)}
        activeItem={this.state.activeItem}
        data={this.state.mediaTrack} />
    <TextTrack
        duration={this.sequenceDuration()}
        onDragStop={this.onTextDragStop.bind(this)}
        onTrackElementAdd={this.onTextTrackElementAdd.bind(this)}
        onTrackEditButtonClick={this.onTextTrackEditButtonClick.bind(this)}
        activeItem={this.state.activeItem}
        data={this.state.textTrack} />
            </span>;
        }

        return <div className="jux-container">
           <div className="vid-container">
                <SpineDisplay
                    spineVid={this.state.spineVid}
                    ref={(c) => this._primaryVid = c}
                    readOnly={this.props.readOnly}
                    duration={this.state.duration}
                    onDuration={this.onSpineDuration.bind(this)}
                    onEnded={this.onSpineVideoEnded.bind(this)}
                    playing={this.state.playing}
                    onProgress={this.onSpineProgress.bind(this)}
                    onPlay={this.onSpinePlay.bind(this)}
                    onPause={this.onSpinePause.bind(this)}
                    instructions={this.props.primaryInstructions}
                />
                <MediaDisplay
                    time={this.state.time}
                    duration={this.sequenceDuration()}
                    data={this.state.mediaTrack}
                    playing={this.state.playing}
                    currentElement={this.state.currentSecondaryElement}
                    instructions={this.props.secondaryInstructions}
                />
            </div>
            <TextDisplay time={this.state.time}
                         duration={this.sequenceDuration()}
                         data={this.state.textTrack} />
            <PlayButton playing={this.state.playing}
                        onClick={this.onPlayClick.bind(this)} />
            <div className="jux-flex-horiz">
                <div className="jux-time">
                    {formatTimecode(this.state.time)} / {formatTimecode(this.sequenceDuration())}
                </div>
            </div>
            <div className="jux-timeline">
                <TimelineRuler duration={this.sequenceDuration()} />
                <Playhead currentTime={this.state.time}
                          duration={this.sequenceDuration()}
                          onMouseDown={this.onPlayheadMouseDown.bind(this)}
                          onMouseUp={this.onPlayheadMouseUp.bind(this)}
                          onChange={this.onPlayheadTimeChange.bind(this)} />
                {tracks}
            </div>
            <TrackElementManager
                activeItem={activeItem}
                onChange={this.onTrackElementUpdate.bind(this)}
                onEditClick={this.onTrackMediaElementEdit.bind(this)}
                onDeleteClick={this.onTrackElementRemove.bind(this)} />
            <OutOfBoundsModal
                showing={this.state.showOutOfBoundsModal}
                onCloseClick={this.onOutOfBoundsCloseClick.bind(this)}
                onConfirmClick={this.onOutOfBoundsConfirmClick.bind(this)} />
        </div>;
    }
    isBaselineWorkCompleted() {
        return !!this.state.spineVid &&
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
                (_.isNumber(newData.start_time) ?
                 newData.start_time : item.start_time),
                (_.isNumber(newData.end_time) ?
                 newData.end_time : item.end_time))
        ) {
            return;
        }

        if (_.isString(newData.source)) {
            item.source = newData.source;
        }
        if (_.isNumber(newData.start_time)) {
            item.start_time = newData.start_time;
        }
        if (_.isNumber(newData.end_time)) {
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
        const newItemKey = newTrack.length;
        const startTime = timecode;
        const endTime =  constrainEndTimeToAvailableSpace(
            startTime, startTime + 30,
            this.sequenceDuration(), this.state.textTrack);
        newTrack.push({
            key: newItemKey,
            start_time: startTime,
            end_time: endTime,
            type: 'txt',
            source: txt
        });
        this.setState({
            textTrack: newTrack,
            activeItem: ['txt', newItemKey]
        });
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
        track.start_time = percent * this.sequenceDuration();
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
        const newState = !this.state.playing;
        this.setState({playing: newState})
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
        jQuery(window).trigger('sequenceassignment.set_dirty', {dirty: true});
    }
    onTrackMediaElementEdit() {
        const item = this.getItem(this.state.activeItem);

        let caller = {'type': 'track'};
        editAnnotationWidget(item.media_asset, item.media,
                             item.annotationDuration === undefined,
                             caller);
    }
    onPlayheadTimeChange(e) {
        const percentDone = e.target.value / 1000;
        const newTime = this.sequenceDuration() * percentDone;
        this.setState({time: newTime});
    }
    onPlayheadMouseDown() {
        this.setState({playing: false});
    }
    onPlayheadMouseUp() {
        const x = this.state.time + (
            this.state.spineVid.annotationStartTime || 0);
        const percentage = x / this.state.duration;
        this._primaryVid.player.seekTo(percentage);
    }
    onSpineVideoEnded() {
        this.setState({playing: false});
    }
    /*
     * This is called when the video's duration is loaded from
     * whichever source it's at (YouTube / Vimeo / HTML5). We
     * can't rely on this callback always being called - for example,
     * it's not called when replacing the spine video with a different
     * selection of the same video, for YouTube and Vimeo videos.
     * PMT #109344
     */
    onSpineDuration(duration) {
        this.setState({
            duration: duration,
            mediaTrack: removeOutOfBoundsElements(
                duration, this.state.mediaTrack),
            textTrack: removeOutOfBoundsElements(
                duration, this.state.textTrack)
        });
        jQuery(window).trigger('sequenceassignment.set_dirty', {dirty: true});
    }
    onSpineProgress(state) {
        if (typeof state.played !== 'undefined') {
            const seconds = (
                state.played * this.state.duration
            ) - (this.state.spineVid.annotationStartTime || 0);

            // Current time should never be negative,
            let time = Math.max(0, seconds);
            // and never greater than the sequence's duration.
            if (time >= this.sequenceDuration()) {
                this.setState({playing: false});
                time = Math.min(time, this.sequenceDuration());
            }

            this.setState({
                time: time,
                currentSecondaryElement: getElement(
                    this.state.mediaTrack, time)
            });
        }
    }
    onSpinePlay() {
        if (!this.state.playing) {
            this.setState({playing: true});
        }
    }
    onSpinePause() {
        if (this.state.playing) {
            this.setState({playing: false});
        }
    }
    onSaveClick() {
        if (!this.state.spineVid) {
            // nothing to save yet
            jQuery(window).trigger(
                'sequenceassignment.on_save_success', {
                    submittable: false});
            return;
        }

        const xhr = new Xhr();
        const self = this;
        xhr.createOrUpdateSequenceAsset(
            this.state.spineVid.annotationId,
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
    onOutOfBoundsCloseClick() {
        this.setState({showOutOfBoundsModal: false});
    }
    onOutOfBoundsConfirmClick() {
        const newSpine = this.state.tmpSpineVid;
        this.setState({
            showOutOfBoundsModal: false,
            mediaTrack: removeOutOfBoundsElements(
                newSpine.annotationDuration, this.state.mediaTrack),
            textTrack: removeOutOfBoundsElements(
                newSpine.annotationDuration, this.state.textTrack)
        });

        this.updateSpineVid(
            newSpine.url, newSpine.host, newSpine.assetId,
            newSpine.annotationId,
            newSpine.annotationStartTime, newSpine.annotationDuration);
        this.setState({tmpSpineVid: null});

        jQuery(window).trigger('sequenceassignment.set_dirty', {dirty: true});
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
    sequenceDuration() {
        if (this.state.spineVid && this.state.spineVid.annotationDuration) {
            return this.state.spineVid.annotationDuration;
        }
        return this.state.duration;
    }
    updateSpineVid(
        url, host, assetId, annotationId,
        annotationStartTime, annotationDuration
    ) {
        if (this.state.spineVid && this.state.spineVid.url !== url) {
            this.setState({duration: null});
        }
        this.setState({
            spineVid: {
                url: url,
                host: host,
                assetId: assetId,
                annotationId: annotationId,
                annotationStartTime: annotationStartTime,
                annotationDuration: annotationDuration
            },
            playing: false,
            time: 0
        });
        this._primaryVid.onStart();
    }
    addOrEditSpineVideo(assetId, annotationId) {
        // This event will either set the spine video, or
        // trigger the insertion of a media element, depending
        // on what the user is doing.
        let self = this;
        const xhr = new Xhr();
        xhr.getAsset(assetId).then(function(json) {
            const ctx = parseAsset(json, assetId, annotationId);

            // Revising the spine video could potentially remove
            // track elements that aren't in this selection's range.
            // If that's the case, warn the user and allow them to
            // cancel the action.
            if ((!ctx.duration ||
                 hasOutOfBoundsElement(
                     ctx.duration,
                     self.state.mediaTrack,
                     self.state.textTrack)) &&
                (self.state.mediaTrack.length > 0 ||
                 self.state.textTrack.length > 0)) {
                self.setState({
                    showOutOfBoundsModal: true,
                    tmpSpineVid: {
                        url: ctx.url,
                        host: ctx.host,
                        assetId: assetId,
                        annotationId: annotationId,
                        annotationStartTime: ctx.startTime,
                        annotationDuration: ctx.duration
                    },
                    playing: false,
                    time: 0
                });
                return;
            }

            // Set the spine video
            self.updateSpineVid(
                ctx.url, ctx.host, assetId,
                annotationId, ctx.startTime, ctx.duration);
        });
    }
    addMediaTrackElement(assetId, annotationId, timecode) {
        let self = this;
        const xhr = new Xhr();
        xhr.getAsset(assetId).then(function(json) {
            const ctx = parseAsset(json, assetId, annotationId);

            let newTrack = self.state.mediaTrack.slice(0);
            const newItemKey = newTrack.length;
            const endTime =  constrainEndTimeToAvailableSpace(
                timecode, timecode + ctx.duration,
                self.sequenceDuration(),
                self.state.mediaTrack);
            newTrack.push({
                key: newItemKey,
                start_time: timecode,
                end_time: endTime,
                type: ctx.type,
                host: ctx.host,
                source: ctx.url,
                media_asset: assetId,
                media: annotationId,
                annotationData: ctx.data,
                annotationStartTime: ctx.startTime,
                annotationDuration: ctx.duration
            });

            self.setState({
                mediaTrack: newTrack,
                activeItem: ['media', newItemKey]
            });
        });
    }
    editActiveMediaTrackElement(assetId, annotationId) {
        let self = this;
        const xhr = new Xhr();
        xhr.getAsset(assetId).then(function(json) {
            let state = _.extend({}, self.state);

            const ctx = parseAsset(json, assetId, annotationId);
            const idx = self.state.activeItem[1];
            const timecode = self.state.mediaTrack[idx].start_time;

            state.mediaTrack[idx].media = annotationId;
            state.mediaTrack[idx].annotationData = ctx.data;
            state.mediaTrack[idx].annotationStartTime = ctx.startTime;
            state.mediaTrack[idx].annotationDuration = ctx.duration;
            const endTime =  constrainEndTimeToAvailableSpace(
                timecode, timecode + ctx.duration,
                self.sequenceDuration(),
                self.state.mediaTrack, idx);
            state.mediaTrack[idx].end_time = endTime;
            self.setState(state);
        });
    }
}
