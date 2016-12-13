import React from 'react';
import {
    getMinutes, getSeconds, getCentiseconds
} from './utils.js';

/**
 * TimecodeUpdater is a form widget that handles updating a
 * timestamp value.
 */
export default class TimecodeUpdater extends React.Component {
    render() {
        return <div className="input-group">
    <input type="number" className="form-control"
           size="2" min="0" required
           onChange={this.onMinutesChange.bind(this)}
           value={getMinutes(this.props.timecode)} />
    <div className="input-group-addon"><strong>:</strong></div>
    <input type="number" className="form-control"
           size="2" min="0" max="59" required
           onChange={this.onSecondsChange.bind(this)}
           value={getSeconds(this.props.timecode)} />
    <div className="input-group-addon"><strong>:</strong></div>
    <input type="number" className="form-control"
           size="2" min="0" max="99" required
           onChange={this.onCentisecondsChange.bind(this)}
           value={getCentiseconds(this.props.timecode)} />
        </div>;
    }
    onMinutesChange(e) {
        this.props.onChange({minutes: parseInt(e.target.value, 10)});
    }
    onSecondsChange(e) {
        this.props.onChange({seconds: parseInt(e.target.value, 10)});
    }
    onCentisecondsChange(e) {
        this.props.onChange({centiseconds: parseInt(e.target.value, 10)});
    }
}
