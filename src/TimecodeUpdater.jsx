import React from 'react';
import {getSeparatedTimeUnits} from './utils.js';

/**
 * TimecodeUpdater is a form widget that handles updating a
 * timestamp value. It doesn't handle its own state. See:
 * https://facebook.github.io/react/docs/lifting-state-up.html#lifting-state-up
 */
export default class TimecodeUpdater extends React.Component {
    render() {
        const units = getSeparatedTimeUnits(this.props.timecode);
        const minutes = units[0];
        const seconds = units[1];
        const centiseconds = units[2];
        return <div className="input-group jux-timecode-editor">
    <input type="number" className="form-control input-sm"
           min="0" required
           onChange={this.onMinutesChange.bind(this)}
           value={minutes} />
    <input type="number" className="form-control input-sm"
           size="2" min="0" max="59" required
           onChange={this.onSecondsChange.bind(this)}
           value={seconds} />
    <input type="number" className="form-control input-sm"
           size="2" min="0" max="99" required
           onChange={this.onCentisecondsChange.bind(this)}
           value={centiseconds} />
        </div>;
    }
    onMinutesChange(e) {
        const minutes = parseInt(e.target.value, 10);
        this.props.onMinutesChange(minutes);
    }
    onSecondsChange(e) {
        const seconds = parseInt(e.target.value, 10);
        this.props.onSecondsChange(seconds);
    }
    onCentisecondsChange(e) {
        const centiseconds = parseInt(e.target.value, 10);
        this.props.onCentisecondsChange(centiseconds);
    }
}
