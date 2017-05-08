/* global jQuery */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {formatTimecode} from './utils.js';
import TimecodeEditor from './TimecodeEditor.jsx';
import DeleteElementModal from './DeleteElementModal.jsx';

export default class TrackElementManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteElementModal: false
        };
        this.debouncedDisplayUpdatedTextNotice = debounce(
            this.displayUpdatedTextNotice, 1000);
    }
    render() {
        const activeElement = this.props.activeElement;

        if (activeElement) {
            const isTextActive = activeElement.type === 'txt';
            const duration = activeElement.end_time - activeElement.start_time;

            let volumeControl = '';
            if (activeElement.type === 'vid') {
                volumeControl = <div className="form-group">
    <label>
        Volume &nbsp;{activeElement.volume}
        <input type="range" min="0" max="100"
               value={activeElement.volume}
               onChange={this.onVolumeChange.bind(this)} />
    </label>
                </div>;
            }

            return <div className="jux-track-container jux-track-element-manager">
    <button className="jux-remove-track-element btn btn-default btn-danger right"
            title="Delete element"
            onClick={this.onDeleteClick.bind(this)}>
        <span className="glyphicon glyphicon-trash"
              aria-hidden="true"></span>
    </button>
    <div className="track-icon left"></div>
    <div className="left">
        <div className="form-inline">
        <div className="form-group">
            <label>
                Start &nbsp;{formatTimecode(activeElement.start_time)}
            </label><br />
            <TimecodeEditor
                min={0}
                timecode={activeElement.start_time}
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
                timecode={activeElement.end_time - activeElement.start_time}
                onChange={this.onDurationChange.bind(this)}
            />
            <div className="helptext">MM:SS:CS</div>
        </div>
        {volumeControl}
        <div className="form-group">
            <label>Content</label><br />
            <textarea style={{'display': isTextActive ? 'block' : 'none'}}
                      className="form-control"
                      value={activeElement.source}
                      maxLength={140}
                      onChange={this.onTextChange.bind(this)} />
            <div style={{'display': isTextActive ? 'block' : 'none'}}
                 className="helptext pull-left">140 character limit</div>
            <div className="pull-right jux-updated-text">
                Updated
            </div>
            <button style={{'display': isTextActive ? 'none' : 'block'}}
                className="jux-edit-track-element btn btn-default btn-sm"
                title="Edit Element"
                onClick={this.onEditClick.bind(this)}>
                <span className="glyphicon glyphicon-pencil"
                      aria-hidden="true"></span> Edit Selection
            </button>
        </div>
        <div className="clearfix"></div>
        </div>
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
    onVolumeChange(e) {
        this.props.onChange(this.props.activeElement, {
            volume: parseInt(e.target.value, 10)
        });
    }
    displayUpdatedTextNotice() {
        jQuery('.jux-updated-text').show(0, function() {
            setTimeout(function() {
                jQuery('.jux-updated-text').fadeOut('slow');
            }, 1000);
        });
    }
    onTextChange(e) {
        this.props.onChange(this.props.activeElement, {
            source: e.target.value
        });
        this.debouncedDisplayUpdatedTextNotice();
    }
    onDeleteClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({showDeleteElementModal: true});
    }
    onDeleteCloseClick() {
        this.setState({showDeleteElementModal: false});
    }
    onDeleteConfirmClick() {
        this.props.onDeleteClick();
        this.setState({showDeleteElementModal: false});
    }
    onEditClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.onEditClick();
    }
    onStartTimeChange(val) {
        const newEndTime = this.props.activeElement.end_time +
              (val - this.props.activeElement.start_time);
        this.props.onChange(this.props.activeElement, {
            start_time: val,
            end_time: newEndTime
        });
    }
    onDurationChange(val) {
        const newTime = this.props.activeElement.start_time + val;
        this.props.onChange(this.props.activeElement, {end_time: newTime});
    }
}

TrackElementManager.propTypes = {
    activeElement: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
};
