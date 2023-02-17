/* global jQuery */

import React from 'react';
import PropTypes from 'prop-types';
import isFinite from 'lodash/isFinite';
import isString from 'lodash/isString';
import find from 'lodash/find';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import {
    collisionPresent, constrainEndTimeToAvailableSpace,
    getElement, findPlacement,
    hasOutOfBoundsElement, removeOutOfBoundsElements,
    parseAsset, parseAnnotation, formatTimecode, loadMediaData, loadTextData,
    reassignKeys, trackItemDragHandler
} from './utils.js';
import {editAnnotationWidget} from './mediathreadCollection.js';
import {defineTimecodeSpinner} from './timecodeSpinner.js';
import MediaTrack from './MediaTrack.jsx';
import MediaDisplay from './MediaDisplay.jsx';
import OutOfBoundsModal from './OutOfBoundsModal.jsx';
import AddPrimaryMediaModal from './AddPrimaryMediaModal.jsx';
import TextTrack from './TextTrack.jsx';
import TextDisplay from './TextDisplay.jsx';
import TimelineRuler from './TimelineRuler.jsx';
import TrackElementManager from './TrackElementManager.jsx';
import PlayButton from './PlayButton.jsx';
import RewindButton from './RewindButton.jsx';
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

            // The selected element that's managed in the TrackElementManager.
            activeElement: null,

            // The currently displaying secondary element
            currentSecondaryElement: null,

            showOutOfBoundsModal: false,
            showAddPrimaryMediaModal: false,

            hoveringOnPlayhead: false
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
            jQuery(window).trigger('sequence.set_dirty', {dirty: true});
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

        document.addEventListener('sequence.save', function() {
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
                   const ctx = parseAnnotation(e.media);
                   e.media = ctx.id;
                   e.media_asset = ctx.assetId;
                   e.host = ctx.host;
                   e.source = ctx.url;
                   e.type = ctx.type;
                   e.annotationStartTime = ctx.startTime;
                   e.annotationDuration = ctx.duration;
                   e.annotationData = ctx.data;
                   e.width = ctx.width;
                   e.height = ctx.height;
               });
               self.setState({
                   mediaTrack: loadMediaData(sequenceAsset.media_elements),
                   textTrack: loadTextData(sequenceAsset.text_elements)
               });

               const spine = parseAnnotation(sequenceAsset.spine);
               self.updateSpineVid(
                   spine.url, spine.host, spine.assetId,
                   spine.id, spine.startTime, spine.duration,
                   sequenceAsset.spine_volume);

               jQuery(window).trigger('sequence.set_submittable', {
                   submittable: self.isBaselineWorkCompleted()
               });
           }).then(function() {
               jQuery('#sequence>.loader').hide();
               jQuery('#jux-container').fadeTo('fast', 1);
           }).catch(function() {
               jQuery('#sequence>.loader').hide();
               jQuery('#jux-container').fadeTo('fast', 1);
           });
    }
    render() {
        const activeElement = this.getItem(this.state.activeElement);
        let tracks = '';
        if (!this.props.readOnly) {
            tracks = <div>
    <MediaTrack
        duration={this.sequenceDuration()}
        primaryVid={this.state.spineVid}
        onAddWithoutPrimaryVid={this.onAddWithoutPrimaryVid.bind(this)}
        onDragStop={this.onMediaDragStop.bind(this)}
        onTrackEditButtonClick={this.onMediaTrackEditButtonClick.bind(this)}
        activeElement={this.state.activeElement}
        data={this.state.mediaTrack} />
    <TextTrack
        duration={this.sequenceDuration()}
        primaryVid={this.state.spineVid}
        onAddWithoutPrimaryVid={this.onAddWithoutPrimaryVid.bind(this)}
        onDragStop={this.onTextDragStop.bind(this)}
        onTrackElementAdd={this.onTextTrackElementAdd.bind(this)}
        onTrackEditButtonClick={this.onTextTrackEditButtonClick.bind(this)}
        activeElement={this.state.activeElement}
        data={this.state.textTrack} />
            </div>;
        }

        let mediaDisplay = '';

        const centerPrimary =  !(this.hasMediaElements() || !this.props.readOnly);
        if (!centerPrimary) {
            mediaDisplay =
                <MediaDisplay
                    ref={(c) => this._mediaDisplay = c}
                    time={this.state.time}
                    duration={this.sequenceDuration()}
                    data={this.state.mediaTrack}
                    playing={this.state.playing}
                    currentElement={this.state.currentSecondaryElement}
                    instructions={this.props.secondaryInstructions}
                />;
        }

        return <div className="jux-container">
           <div className="jux-vid-container">
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
                    onVolumeChange={this.onSpineVolumeChange.bind(this)}
                    onVolumeToggle={this.onSpineVolumeToggle.bind(this)}
                    instructions={this.props.primaryInstructions}
                />
                <div style={{
                    'display': centerPrimary ? 'none' : 'block'
                }} className="jux-media-separator"></div>
                {mediaDisplay}
            </div>
            <TextDisplay time={this.state.time}
                         duration={this.sequenceDuration()}
                         data={this.state.textTrack} />

            <div className="jux-flex-horiz">
                <RewindButton time={this.state.time || 0}
                              onClick={this.onRewindClick.bind(this)} />
                <PlayButton playing={this.state.playing}
                            onClick={this.onPlayClick.bind(this)} />
                <div className="jux-time-display">
                    <div>
                        {formatTimecode(this.state.time)} / {formatTimecode(this.sequenceDuration())}
                    </div>
                </div>
            </div>
            <div className="jux-timeline">
                <TimelineRuler
                    hovering={this.state.hoveringOnPlayhead}
                    duration={this.sequenceDuration()} />
                <Playhead currentTime={this.state.time}
                          duration={this.sequenceDuration()}
                          onMouseDown={this.onPlayheadMouseDown.bind(this)}
                          onMouseUp={this.onPlayheadMouseUp.bind(this)}
                          onMouseEnter={this.onPlayheadMouseEnter.bind(this)}
                          onMouseLeave={this.onPlayheadMouseLeave.bind(this)}
                          onChange={this.onPlayheadTimeChange.bind(this)} />
                {tracks}
            </div>
            <TrackElementManager
                activeElement={activeElement}
                onChange={this.onTrackElementUpdate.bind(this)}
                onEditClick={this.onTrackMediaElementEdit.bind(this)}
                onDeleteClick={this.onTrackElementRemove.bind(this)}
                duration={this.state.duration} />
            <OutOfBoundsModal
                showing={this.state.showOutOfBoundsModal}
                onCloseClick={this.onOutOfBoundsCloseClick.bind(this)}
                onConfirmClick={this.onOutOfBoundsConfirmClick.bind(this)} />
            <AddPrimaryMediaModal
                showing={this.state.showAddPrimaryMediaModal}
                onCloseClick={this.onAddPrimaryCloseClick.bind(this)} />
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
    onTrackElementUpdate(activeElement, newData) {
        if (!activeElement) {
            return;
        }

        let track = null;
        if (activeElement.type === 'txt') {
            track = this.state.textTrack;
        } else {
            track = this.state.mediaTrack;
        }

        const item = find(track, ['key', activeElement.key, 10]);
        let newTrack = reject(track, ['key', item.key]);

        // If there's a collision present given the new start_time and
        // end_time, cancel this action.
        if (
            collisionPresent(
                newTrack,
                this.sequenceDuration(),
                (isFinite(newData.start_time) ?
                 newData.start_time : item.start_time),
                (isFinite(newData.end_time) ?
                 newData.end_time : item.end_time))
        ) {
            return;
        }

        if (isString(newData.source)) {
            item.source = newData.source;
        }
        if (isFinite(newData.start_time)) {
            item.start_time = newData.start_time;
        }
        if (isFinite(newData.end_time)) {
            item.end_time = newData.end_time;
        }
        if (isFinite(newData.volume)) {
            item.volume = newData.volume;
        }

        newTrack.push(item);
        newTrack = sortBy(newTrack, 'key');

        if (activeElement.type === 'txt') {
            this.setState({textTrack: newTrack});
        } else {
            this.setState({mediaTrack: newTrack});
        }

        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onTextTrackElementAdd(txt, timecode) {
        const placement = findPlacement(
            timecode, timecode + 30,
            this.sequenceDuration(), this.state.textTrack);

        if (!isFinite(placement.start) && !isFinite(placement.end)) {
            return;
        }

        let newTrack = this.state.textTrack.slice();
        const newItemKey = newTrack.length;
        newTrack.push({
            key: newItemKey,
            start_time: placement.start,
            end_time: placement.end,
            type: 'txt',
            source: txt
        });
        this.setState({
            textTrack: newTrack,
            activeElement: ['txt', newItemKey]
        });
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }

    onMediaTrackEditButtonClick(event, item) {
        this.setState({activeElement: ['media', item.props.data.key]});
    }
    onTextTrackEditButtonClick(event, item) {
        this.setState({activeElement: ['txt', item.props.data.key]});
    }
    onMediaDragStop(items, event, item) {
        const newTrack = trackItemDragHandler(
            this.state.mediaTrack, item, this.sequenceDuration());
        if (newTrack === null) {
            return;
        }

        this.setState({mediaTrack: newTrack});
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onTextDragStop(items, event, item) {
        const newTrack = trackItemDragHandler(
            this.state.textTrack, item, this.sequenceDuration());
        if (newTrack === null) {
            return;
        }

        this.setState({textTrack: newTrack});
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onPlayClick() {
        const newState = !this.state.playing;
        this.setState({playing: newState})
    }
    onRewindClick() {
        this.setState({
            playing: false,
            time: 0
        });

        this._primaryVid.player.seekTo(
            this.state.spineVid.annotationStartTime || 0);
    }
    /**
     * Remove the active track item.
     */
    onTrackElementRemove() {
        if (!this.state.activeElement) {
            return;
        }

        const track = this.state.activeElement[0];
        const i = this.state.activeElement[1];

        if (track === 'txt') {
            let newTrack = this.state.textTrack.slice();
            newTrack.splice(i, 1);
            reassignKeys(newTrack);
            this.setState({
                textTrack: newTrack,
                activeElement: null
            });
        } else {
            let newTrack = this.state.mediaTrack.slice();
            newTrack.splice(i, 1);
            reassignKeys(newTrack);
            this.setState({
                mediaTrack: newTrack,
                activeElement: null
            });
        }
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onTrackMediaElementEdit() {
        const item = this.getItem(this.state.activeElement);

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
        if (this._mediaDisplay) {
            this._mediaDisplay.seekTo(percentage);
        }
    }
    onPlayheadMouseEnter() {
        this.setState({hoveringOnPlayhead: true});
    }
    onPlayheadMouseLeave() {
        this.setState({hoveringOnPlayhead: false});
    }
    onSpineVideoEnded() {
        this.setState({
            playing: false,
            time: 0
        });
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
        this.setState((prevState) => {
            return {
                duration: duration,
                mediaTrack: removeOutOfBoundsElements(
                    duration, prevState.mediaTrack),
                textTrack: removeOutOfBoundsElements(
                    duration, prevState.textTrack)
            };
        });
    }
    onSpineProgress(state) {
        if (typeof state.played !== 'undefined') {
            if (state.played >= 1) {
                this.setState({
                    playing: false,
                    time: 0
                });
                return;
            }

            const seconds = state.playedSeconds - (
                this.state.spineVid.annotationStartTime || 0);

            // Current time should never be negative,
            let time = Math.max(0, seconds);
            // and never greater than the sequence's duration.
            if (time >= this.sequenceDuration()) {
                this.setState({playing: false});
                time = Math.min(time, this.sequenceDuration());
            }

            this.setState((prevState) => {
                return {
                    time: time,
                    currentSecondaryElement: getElement(
                        prevState.mediaTrack, time)
                };
            });
        }
    }
    onSpinePlay() {
        // If the user clicks the spine video (triggering this onPlay
        // event), make sure that the sequence state is updated to
        // playing: true.
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
                'sequence.on_save_success', {
                    submittable: false});
            return;
        }

        const xhr = new Xhr();
        const self = this;
        xhr.createOrUpdateSequenceAsset(
            this.state.spineVid.annotationId,
            this.state.spineVid.volume,
            window.MediaThread.current_course,
            window.MediaThread.current_project,
            this.state.mediaTrack,
            this.state.textTrack
        ).then(function() {
            jQuery(window).trigger(
                'sequence.on_save_success', {
                    submittable: self.isBaselineWorkCompleted()
                });
        }).catch(function(e) {
            // Open Mediathread's error popup
            jQuery(window).trigger('sequence.on_save_error', e);
        });
    }
    onOutOfBoundsCloseClick() {
        this.setState({showOutOfBoundsModal: false});
    }
    onOutOfBoundsConfirmClick() {
        const newSpine = this.state.tmpSpineVid;
        this.setState((prevState) => {
            return {
                showOutOfBoundsModal: false,
                mediaTrack: removeOutOfBoundsElements(
                    newSpine.annotationDuration, prevState.mediaTrack),
                textTrack: removeOutOfBoundsElements(
                    newSpine.annotationDuration, prevState.textTrack)
            };
        });

        this.updateSpineVid(
            newSpine.url, newSpine.host, newSpine.assetId,
            newSpine.annotationId,
            newSpine.annotationStartTime, newSpine.annotationDuration,
            newSpine.volume);
        this.setState({tmpSpineVid: null});

        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onAddWithoutPrimaryVid() {
        this.setState({showAddPrimaryMediaModal: true});
    }
    onAddPrimaryCloseClick() {
        this.setState({showAddPrimaryMediaModal: false});
    }
    onSpineVolumeChange(volume) {
        let spineVid = this.state.spineVid;
        spineVid.volume = volume;
        this.setState({spineVid: spineVid});
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    onSpineVolumeToggle() {
        let volume = 80;
        if (this.state.spineVid.volume) {
            volume = 0;
        }
        let spineVid = this.state.spineVid;
        spineVid.volume = volume;
        this.setState({spineVid: spineVid});
        jQuery(window).trigger('sequence.set_dirty', {dirty: true});
    }
    /**
     * Get the item in textTrack or mediaTrack, based on the activeElement
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
        annotationStartTime, annotationDuration, volume
    ) {
        if (!isFinite(volume)) {
            volume = 80;
        }

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
                annotationDuration: annotationDuration,
                volume: volume
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
                        annotationDuration: ctx.duration,
                        volume: ctx.volume
                    },
                    playing: false,
                    time: 0
                });
                return;
            }

            // Set the spine video
            self.updateSpineVid(
                ctx.url, ctx.host, assetId,
                annotationId, ctx.startTime, ctx.duration,
                ctx.volume);
        });
    }
    addMediaTrackElement(assetId, annotationId, timecode) {
        let self = this;
        const xhr = new Xhr();
        xhr.getAsset(assetId).then(function(json) {
            const ctx = parseAsset(json, assetId, annotationId);

            let newTrack = self.state.mediaTrack.slice(0);
            const newItemKey = newTrack.length;
            const placement = findPlacement(
                timecode, timecode + ctx.duration,
                self.sequenceDuration(), self.state.mediaTrack);

            if (!isFinite(placement.start) && !isFinite(placement.end)) {
                return;
            }

            newTrack.push({
                key: newItemKey,
                start_time: placement.start,
                end_time: placement.end,
                type: ctx.type,
                host: ctx.host,
                source: ctx.url,
                media_asset: assetId,
                media: annotationId,
                annotationData: ctx.data,
                annotationStartTime: ctx.startTime,
                annotationDuration: ctx.duration,
                width: ctx.width,
                height: ctx.height,
                volume: 80
            });

            self.setState({
                mediaTrack: newTrack,
                activeElement: ['media', newItemKey]
            });
        });
    }
    editActiveMediaTrackElement(assetId, annotationId) {
        const self = this;
        const xhr = new Xhr();
        xhr.getAsset(assetId).then(function(json) {
            let newMediaTrack = self.state.mediaTrack.slice();

            const ctx = parseAsset(json, assetId, annotationId);
            const idx = self.state.activeElement[1];
            const el = self.state.mediaTrack[idx];
            const timecode = el.start_time;
            const elDuration = ctx.duration || (el.end_time - el.start_time);

            newMediaTrack[idx].media = annotationId;
            newMediaTrack[idx].annotationData = ctx.data;
            newMediaTrack[idx].annotationStartTime = ctx.startTime;
            newMediaTrack[idx].annotationDuration = ctx.duration;

            const track = self.state.mediaTrack.slice();
            track.splice(idx, 1);
            const endTime =  constrainEndTimeToAvailableSpace(
                timecode, timecode + elDuration,
                self.sequenceDuration(),
                track);
            newMediaTrack[idx].end_time = endTime;

            self.setState({
                mediaTrack: newMediaTrack
            });
            jQuery(window).trigger('sequence.set_dirty', {dirty: true});
        });
    }
    hasMediaElements() {
        return this.state.mediaTrack.length > 0;
    }
}

JuxtaposeApplication.propTypes = {
    primaryInstructions: PropTypes.string.isRequired,
    secondaryInstructions: PropTypes.string.isRequired,
    readOnly: PropTypes.bool.isRequired
};

JuxtaposeApplication.defaultProps = {
    primaryInstructions: '',
    secondaryInstructions: '',
    readOnly: false
};
