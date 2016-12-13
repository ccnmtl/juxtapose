import React from 'react';
import {formatTimecode} from './utils.js';
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
                    onChange={this.onStartTimeChange.bind(this)} />
            </label>
        </div>
        <div className="form-group">
            <label>
                End time: {formatTimecode(this.props.activeItem.end_time)}
                <TimecodeUpdater
                    timecode={this.props.activeItem.end_time}
                    onChange={this.onEndTimeChange.bind(this)} />
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
        console.log('onTextChange', e.target.value);
    }
    onDeleteClick(e) {
        this.props.onDeleteClick();
    }
    onStartTimeChange(startTime) {
        console.log('onStartTimeChange', startTime);
    }
    onEndTimeChange(endTime) {
        console.log('onEndTimeChange', endTime);
    }
}
