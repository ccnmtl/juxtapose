import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import _ from 'lodash';
import {formatDuration} from './utils.js';
import {auxTrackData, textTrackData, collectionData} from './data.js';
import AuxTrack from './AuxTrack.jsx';
import AuxDisplay from './AuxDisplay.jsx';
import TextTrack from './TextTrack.jsx';
import TextDisplay from './TextDisplay.jsx';
import TimelineRuler from './TimelineRuler.jsx';
import TrackItemManager from './TrackItemManager.jsx';
import PlayButton from './PlayButton.jsx';
import Playhead from './Playhead.jsx';
import SpineVideo from './SpineVideo.jsx';


export default class JuxtaposeApplication extends React.Component {
    constructor() {
        super();
        this.state = {
            auxTrack: auxTrackData,
            textTrack: textTrackData,
            collectionData: collectionData,

            globalAnnotation: 'Triangle animation + Belbury Poly video',

            isPlaying: false,
            time: null,
            duration: null,

            // The selected item that's managed in the TrackItemManager.
            activeItem: null
        };
    }
    render() {
        const activeItem = this.getItem(this.state.activeItem);
        return <div className="jux-container">
           <textarea className="jux-global-annotation"
                     defaultValue={this.state.globalAnnotation} />
           <div className="vid-container">
                <SpineVideo
                    ref={(c) => this._spineVid = c}
                    callbackParent={this.onTimeUpdate.bind(this)} />
                <AuxDisplay time={this.state.time}
                            data={this.state.auxTrack}
                            ref={(c) => this._auxVid = c} />
            </div>
            <TextDisplay time={this.state.time}
                         duration={this.state.duration} />
            <div className="jux-flex-horiz">
                <PlayButton isPlaying={this.state.isPlaying}
                            onClick={this.onPlayClick.bind(this)} />
                <div className="jux-time">
                    {formatDuration(this.state.time)} / {formatDuration(this.state.duration)}
                </div>
            </div>
            <div className="jux-timeline">
                <TimelineRuler duration={this.state.duration} />
                <Playhead currentTime={this.state.time}
                          duration={this.state.duration}
                          onChange={this.onPlayheadTimeChange.bind(this)} />
                <AuxTrack duration={this.state.duration}
                          onDragStop={this.onAuxDragStop.bind(this)}
                          onTrackItemAdd={this.onTrackItemAdd.bind(this)}
                          collectionData={this.state.collectionData}
                          activeItem={this.state.activeItem}
                          data={this.state.auxTrack} />
                <TextTrack duration={this.state.duration}
                           onDragStop={this.onTextDragStop.bind(this)}
                           onTrackItemAdd={this.onTrackItemAdd.bind(this)}
                           activeItem={this.state.activeItem}
                           data={this.state.textTrack} />
            </div>
            <TrackItemManager
                activeItem={activeItem}
                onSubmit={this.onTrackItemUpdate.bind(this)}
                onDeleteClick={this.onTrackItemRemove.bind(this)} />
        </div>;
    }
    /**
     * Update a track item's source value, for TrackItemManager.
     */
    onTrackItemUpdate(activeItem, newData) {
        if (!activeItem) {
            return;
        }

        let track = null;
        if (activeItem.type === 'txt') {
            track = this.state.textTrack;
        } else {
            track = this.state.auxTrack;
        }

        const item = _.find(track, ['key', activeItem.key, 10]);

        item.source = newData.value;
        item.endTime = item.startTime + newData.duration;

        let newTrack = _.reject(track, ['key', item.key]);
        newTrack.push(item);
        newTrack = _.sortBy(newTrack, 'key');

        if (activeItem.type === 'txt') {
            this.setState({textTrack: newTrack});
        } else {
            this.setState({auxTrack: newTrack});
        }
    }
    onTrackItemAdd(txt, timestamp) {
        var newTrack = this.state.textTrack.slice();
        newTrack.push({
            key: newTrack.length,
            startTime: 30,
            endTime: 50,
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
        const len = track.endTime - track.startTime;
        track.startTime = percent * this.state.duration;
        track.endTime = track.startTime + len;

        // TODO: can this be simplified?
        let newTrack = _.reject(origTrack, ['key', track.key]);
        newTrack.push(track);
        newTrack = _.sortBy(newTrack, 'key');
        return newTrack;
    }
    onAuxDragStop(items, event, item) {
        const newTrack = this.trackItemDragHandler(this.state.auxTrack, item);
        this.setState({
            activeItem: ['aux', item.i],
            auxTrack: newTrack
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
            this._spineVid.play();
            this._auxVid.play();
        } else {
            this._spineVid.pause();
            this._auxVid.pause();
        }
    }
    onTimeUpdate(time, duration) {
        this.setState({
            time: time,
            duration: duration
        });
    }
    /**
     * Remove the active track item.
     */
    onTrackItemRemove() {
        if (!this.state.activeItem) {
            return;
        }

        const track = this.state.activeItem[0];
        const i = this.state.activeItem[1];

        if (track === 'txt') {
            var newTrack = this.state.textTrack.slice();
            newTrack.splice(i, 1);
            this.setState({
                textTrack: newTrack,
                activeItem: null
            });
        } else {
            var newTrack = this.state.auxTrack.slice();
            newTrack.splice(i, 1);
            this.setState({
                auxTrack: newTrack,
                activeItem: null
            });
        }
    }
    onPlayheadTimeChange(e) {
        const percentDone = e.target.value / 1000;
        const newTime = this.state.duration * percentDone;
        const state = {
            time: newTime,
            duration: this.state.duration
        }
        this.setState(state);
        // TODO: does the spine vid need its own state?
        this._spineVid.setState(state);
        this._spineVid.updateVidPosition(newTime);
    }
    /**
     * Get the item in textTrack or auxTrack, based on the activeItem
     * format: [track type, index]
     */
    getItem(a) {
        if (!a) {
            return null;
        }

        if (a[0] === 'txt') {
            return this.state.textTrack[a[1]];
        } else {
            return this.state.auxTrack[a[1]];
        }
    }
}
