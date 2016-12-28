import React from 'react';
import {parseTimecode} from './utils.js';

/**
 * TimecodeEditor is a form widget that handles updating a
 * timestamp value. It doesn't handle its own state. See:
 * https://facebook.github.io/react/docs/lifting-state-up.html#lifting-state-up
 */
export default class TimecodeEditor extends React.Component {
    render() {
        return <div className="jux-timecode-editor">
    <input ref="spinner" min="0" required
           onChange={this.props.onChange}
           value={this.props.timecode * 100} />
        </div>;
    }
    componentDidMount() {
        this.$node = jQuery(this.refs.spinner);
        const self = this;
        this.$node.timecodespinner({
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
}
