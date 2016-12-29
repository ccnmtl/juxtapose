import React from 'react';
import {
    formatTimecode, getMinutes, getSeconds, getCentiseconds
} from './utils.js';
import TimecodeEditor from './TimecodeEditor.jsx';
import DeleteElementModal from './DeleteElementModal.jsx';

export default class TrackElementManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteElementModal: false
        };
    }
    render() {
        const activeItem = this.props.activeItem;

        if (activeItem) {
            let displayTextarea = 'none';
            let displayEditSelection = 'block';
            let maxLength = Infinity;
            if (activeItem.type === 'txt') {
                displayTextarea = 'block';
                displayEditSelection = 'none';
                maxLength = 140;
            }
            const duration = activeItem.end_time - activeItem.start_time;
            return <div className="jux-track-container jux-track-element-manager">
    <button className="jux-remove-track-element btn btn-default btn-danger right"
            title="Delete element"
            onClick={this.onDeleteClick.bind(this)}>
        <span className="glyphicon glyphicon-trash"
              aria-hidden="true"></span>
    </button>
    <div className="track-icon left"></div>
    <div className="left">
        <form className="form-inline">
        <div className="form-group">
            <label>
                Start &nbsp;{formatTimecode(activeItem.start_time)}
            </label><br />    
            <TimecodeEditor
                min={0}
                timecode={activeItem.start_time}
                onChange={this.onStartTimeChange.bind(this)}
            />
            <div className="helptext">MM:SS:CS</div>
        </div>
        <div className="form-group">
            <label>
                Duration &nbsp;{formatTimecode(duration)}
            </label><br />
            <TimecodeEditor
                min={100}
                timecode={activeItem.end_time - activeItem.start_time}
                onChange={this.onDurationChange.bind(this)}
            />
            <div className="helptext">MM:SS:CS</div>
        </div>
        <div className="form-group">
            <label>Content</label><br />
            <textarea style={{'display': displayTextarea}}
                      className="form-control"
                      value={activeItem.source}
                      maxLength={maxLength}
                      onChange={this.onTextChange.bind(this)} />
            <div style={{'display': displayTextarea}}
                 className="helptext">140 character limit</div>
            <button style={{'display': displayEditSelection}}
                className="jux-edit-track-element btn btn-default btn-sm"
                title="Edit Element"
                onClick={this.onEditClick.bind(this)}>
                <span className="glyphicon glyphicon-pencil"
                      aria-hidden="true"></span> Edit Selection
            </button>
        </div>
        <div className="clearfix"></div>
        </form>
        <DeleteElementModal
            showing={this.state.showDeleteElementModal}
            onCloseClick={this.onDeleteCloseClick.bind(this)}
            onConfirmClick={this.onDeleteConfirmClick.bind(this)} />
    </div>
    
    <div className="clearfix"></div>
            </div>;
        } else {
            return <div></div>;
        }
    }
    onTextChange(e) {
        this.props.onChange(this.props.activeItem, {source: e.target.value});
    }
    onDeleteClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({showDeleteElementModal: true});
    }
    onDeleteCloseClick(e) {
        this.setState({showDeleteElementModal: false});
    }
    onDeleteConfirmClick(e) {
        this.props.onDeleteClick();
        this.setState({showDeleteElementModal: false});
    }
    onEditClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.onEditClick();
    }
    onStartTimeChange(val) {
        const newEndTime = this.props.activeItem.end_time +
              (val - this.props.activeItem.start_time);
        this.props.onChange(this.props.activeItem, {
            start_time: val,
            end_time: newEndTime
        });
    }
    onDurationChange(val) {
        const newTime = this.props.activeItem.start_time + val;
        this.props.onChange(this.props.activeItem, {end_time: newTime});
    }
}
