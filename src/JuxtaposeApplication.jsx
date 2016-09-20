import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import _ from 'lodash';
import {pad2, formatDuration} from './utils.js';
import {auxTrackData, textTrackData} from './data.js';
import AuxTrack from './AuxTrack.jsx';
import AuxDisplay from './AuxDisplay.jsx';
import TextTrack from './TextTrack.jsx';
import TextDisplay from './TextDisplay.jsx';
import TrackItemManager from './TrackItemManager.jsx';
import PlayButton from './PlayButton.jsx';
import Playhead from './Playhead.jsx';
import SpineVideo from './SpineVideo.jsx';


export default class JuxtaposeApplication extends React.Component {
    constructor() {
        super();
        this.state = {
            time: null,
            duration: null,
            auxTrack: auxTrackData,
            textTrack: textTrackData,

            // The selected item that's managed in the TrackItemManager.
            activeItem: null
        };
    }
    render() {
        const activeItem = this.getItem(this.state.activeItem);
        return <div className="jux-container">
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
            <div className="flex-horiz">
                <PlayButton callbackParent={this.onPlayChanged.bind(this)} />
                <div className="jux-time">
                    {formatDuration(this.state.time)} / {formatDuration(this.state.duration)}
                </div>
            </div>
            <div className="jux-timeline">
                <Playhead ref={(c) => this._playhead = c}
                          callbackParent={this.onPlayheadUpdate.bind(this)} />
                <AuxTrack duration={this.state.duration}
                          onDragStop={this.onAuxDragStop.bind(this)}
                          data={this.state.auxTrack} />
                <TextTrack duration={this.state.duration}
                           onDragStop={this.onTextDragStop.bind(this)}
                           onTrackItemAdd={this.onTrackItemAdd.bind(this)}
                           data={this.state.textTrack} />
            </div>
            <TrackItemManager
                activeItem={activeItem}
                callbackParent={this.onTrackItemRemove.bind(this)} />
        </div>;
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
    onPlayChanged(play) {
        if (play) {
            this._spineVid.play();
            this._auxVid.play();
        } else {
            this._spineVid.pause();
            this._auxVid.pause();
        }
    }
    onTimeUpdate(time, duration) {
        // TODO: this works for now, but I have a feeling this isn't the
        // right way to share state. Even if it is... the code is messy.
        const state = {
            time: time,
            duration: duration
        };
        this._playhead.setState(state);
        this.setState(state);
    }
    onPlayheadUpdate(time, duration) {
        const state = {
            time: time,
            duration: duration
        };
        this._spineVid.setState(state);
        this._spineVid.updateVidPosition(time);
        this.setState(state);
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
