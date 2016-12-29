import React from 'react';
import {formatTimecode, parseTimecode} from './utils.js';

/**
 * TimecodeEditor is a form widget that handles updating a
 * timestamp value. It doesn't handle its own state. See:
 * https://facebook.github.io/react/docs/lifting-state-up.html#lifting-state-up
 */
export default class TimecodeEditor extends React.Component {
    render() {
        return <div className="jux-timecode-editor">
    <input ref="spinner" min="0" required
           defaultValue={formatTimecode(this.props.timecode)} />
        </div>;
    }
    componentDidMount() {
        const self = this;
        jQuery(this.refs.spinner).timecodespinner({
            change: function(e) {
                const seconds = parseTimecode(e.target.value);
                self.props.onChange(seconds);
            },
            spin: function(e) {
                const seconds = parseTimecode(e.target.value);
                self.props.onChange(seconds);
            }
        });
    }
    componentWillUnmount() {
        jQuery(this.refs.spinner).timecodespinner('destroy');
    }
}
