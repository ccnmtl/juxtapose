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
        <input type="range" min="0" max="100" aria-label="range"
               value={activeElement.volume}
               onChange={this.onVolumeChange.bind(this)} />
    </label>
                </div>;
            }

            return <div className="jux-track-container jux-track-element-manager">
    <div className="row">



        <div className="col-md-1 float-left">
            <svg width="3em" height="3em" viewBox="0 0 16 16" className="bi bi-arrows-move" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.5 8a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1H6a.5.5 0 0 0 .5-.5z"/>
              <path fillRule="evenodd" d="M3.854 5.646a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L2.207 8l1.647-1.646a.5.5 0 0 0 0-.708zM9.5 8a.5.5 0 0 1 .5-.5h4.5a.5.5 0 0 1 0 1H10a.5.5 0 0 1-.5-.5z"/>
              <path fillRule="evenodd" d="M12.146 5.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L13.793 8l-1.647-1.646a.5.5 0 0 1 0-.708zM8 9.5a.5.5 0 0 0-.5.5v4.5a.5.5 0 0 0 1 0V10a.5.5 0 0 0-.5-.5z"/>
              <path fillRule="evenodd" d="M5.646 12.146a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8 13.793l-1.646-1.647a.5.5 0 0 0-.708 0zM8 6.5a.5.5 0 0 1-.5-.5V1.5a.5.5 0 0 1 1 0V6a.5.5 0 0 1-.5.5z"/>
              <path fillRule="evenodd" d="M5.646 3.854a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8 2.207 6.354 3.854a.5.5 0 0 1-.708 0z"/>
            </svg>
        </div>

        <div className="col-md-2">
            <div className="form-group">
                <label className="small">
                    Start <br />{formatTimecode(activeElement.start_time)}
                </label><br />
                <TimecodeEditor
                    min={0}
                    max={this.props.duration}
                    timecode={activeElement.start_time}
                    onChange={this.onStartTimeChange.bind(this)}
                />
                <div className="helptext">MM:SS:CS</div>
            </div>
        </div>
        <div className="col-md-2">
            <div className="form-group">
                <label className="small">
                    Duration &nbsp;{formatTimecode(duration)}
                </label><br />
                <TimecodeEditor
                    min={1}
                    max={this.props.duration}
                    timecode={activeElement.end_time - activeElement.start_time}
                    onChange={this.onDurationChange.bind(this)}
                />
                <div className="helptext">MM:SS:CS</div>
            </div>
            {volumeControl}
        </div>
        <div className="col">
            <div className="form-group">
                <label htmlFor="content" className="small">Content</label><br />
                <textarea style={{'display': isTextActive ? 'block' : 'none'}}
                          className="form-control"
                          id="content"
                          value={activeElement.source}
                          maxLength={140}
                          onChange={this.onTextChange.bind(this)} />
                <div style={{'display': isTextActive ? 'block' : 'none'}}
                     className="helptext float-left">140 character limit</div>
                <div className="float-right jux-updated-text small">
                    Updated
                </div>
                <button style={{'display': isTextActive ? 'none' : 'block'}}
                    className="jux-edit-track-element btn btn-outline-secondary btn-sm"
                    title="Edit Element"
                    onClick={this.onEditClick.bind(this)}>
                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
                      <path fillRule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
                    </svg> Edit Selection
                </button>
            </div>
        </div>
        <div className="col float-right">
        <button className="jux-remove-track-element btn btn-secondary btn-danger float-right"
                title="Delete element"
                onClick={this.onDeleteClick.bind(this)}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
        </button>
        </div>
        </div>
        <DeleteElementModal
            showing={this.state.showDeleteElementModal}
            onCloseClick={this.onDeleteCloseClick.bind(this)}
            onConfirmClick={this.onDeleteConfirmClick.bind(this)} />


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
    onEditClick: PropTypes.func.isRequired,

    // Don't mark this as required as the video duration may still be
    // loading.
    duration: PropTypes.number
};
