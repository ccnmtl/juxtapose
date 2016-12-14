import React from 'react';
import {
    formatTimecode, getMinutes, getSeconds, getCentiseconds
} from './utils.js';
import TimecodeUpdater from './TimecodeUpdater.jsx';

export default class TrackElementManager extends React.Component {
    render() {
        const activeItem = this.props.activeItem;

        if (activeItem) {
            let displayTextarea = 'none';
            let maxLength = Infinity;
            if (activeItem.type === 'txt') {
                displayTextarea = 'block';
                maxLength = 140;
            }
            return <div className="jux-track-element-manager">
    <form>
        <div className="form-group">
            <label>
                Start time: {formatTimecode(this.props.activeItem.start_time)}
                <TimecodeUpdater
                    timecode={this.props.activeItem.start_time}
                    onMinutesChange={this.onStartTimeMinutesChange.bind(this)}
                    onSecondsChange={this.onStartTimeSecondsChange.bind(this)}
                    onCentisecondsChange={this.onStartTimeCentisecondsChange.bind(this)}
                />
            </label>
        </div>
        <div className="form-group">
            <label>
                End time: {formatTimecode(this.props.activeItem.end_time)}
                <TimecodeUpdater
                    timecode={this.props.activeItem.end_time}
                    onMinutesChange={this.onEndTimeMinutesChange.bind(this)}
                    onSecondsChange={this.onEndTimeSecondsChange.bind(this)}
                    onCentisecondsChange={this.onEndTimeCentisecondsChange.bind(this)}
                />
            </label>
        </div>
        <div className="form-group">
            <textarea style={{'display': displayTextarea}}
                      className="form-control"
                      value={this.props.activeItem.source}
                      maxLength={maxLength}
                      onChange={this.onTextChange.bind(this)} />
        </div>
        <div className="form-group">
            <button className="jux-remove-track-element btn btn-default"
                    title="Delete Item"
                    onClick={this.onDeleteClick.bind(this)}>
                <span className="glyphicon glyphicon-trash"
                      aria-hidden="true"></span>
            </button>
        </div>
        <div className="clearfix"></div>
    </form>
            </div>;
        } else {
            return <div></div>;
        }
    }
    onTextChange(e) {
        this.props.onChange(this.props.activeItem, {source: e.target.value});
    }
    onDeleteClick(e) {
        this.props.onDeleteClick();
    }
    onStartTimeMinutesChange(val) {
        const minutes = getMinutes(this.props.activeItem.start_time);
        const newTime = this.props.activeItem.start_time -
                        (minutes * 60) + (val * 60);
        this.props.onChange(this.props.activeItem, {start_time: newTime});
    }
    onStartTimeSecondsChange(val) {
        const seconds = getSeconds(this.props.activeItem.start_time);
        const newTime = this.props.activeItem.start_time - seconds + val;
        this.props.onChange(this.props.activeItem, {start_time: newTime});
    }
    onStartTimeCentisecondsChange(val) {
        const centiseconds = getCentiseconds(this.props.activeItem.start_time);
        const newTime = this.props.activeItem.start_time -
                        (centiseconds / 100) + (val / 100);
        this.props.onChange(this.props.activeItem, {start_time: newTime});
    }
    onEndTimeMinutesChange(val) {
        const minutes = getMinutes(this.props.activeItem.end_time);
        const newTime = this.props.activeItem.end_time -
                        (minutes * 60) + (val * 60);
        this.props.onChange(this.props.activeItem, {end_time: newTime});
    }
    onEndTimeSecondsChange(val) {
        const seconds = getSeconds(this.props.activeItem.end_time);
        const newTime = this.props.activeItem.end_time - seconds + val;
        this.props.onChange(this.props.activeItem, {end_time: newTime});
    }
    onEndTimeCentisecondsChange(val) {
        const centiseconds = getCentiseconds(this.props.activeItem.end_time);
        const newTime = this.props.activeItem.end_time -
                        (centiseconds / 100) + (val / 100);
        this.props.onChange(this.props.activeItem, {end_time: newTime});
    }
}
