/* global jQuery */

import React from 'react';
import PropTypes from 'prop-types';
import isFinite from 'lodash/isFinite';
import {formatTimecode, parseTimecode} from './utils.js';

/**
 * TimecodeEditor is a form widget that handles updating a
 * timestamp value. It doesn't handle its own state. See:
 * https://facebook.github.io/react/docs/lifting-state-up.html#lifting-state-up
 */
export default class TimecodeEditor extends React.Component {
    render() {
        return <div className="jux-timecode-editor">
    <input ref="spinner" min={this.props.min} required
           defaultValue={formatTimecode(this.props.timecode)} />
        </div>;
    }
    componentWillReceiveProps(props) {
        // Because this is an uncontrolled input, we need to manually
        // update the value of the input when the active element is
        // updated.
        if (parseTimecode(this.refs.spinner.value) !== props.timecode) {
            this.refs.spinner.value = formatTimecode(props.timecode);
        }
    }
    componentDidMount() {
        const self = this;
        jQuery(this.refs.spinner).timecodespinner({
            change: function(e) {
                const seconds = parseTimecode(e.target.value);
                if (isFinite(seconds)) {
                    self.props.onChange(seconds);
                }

                if (self.props.timecode !== self.refs.spinner.value) {
                    // Update the input value from the application state
                    // when the user puts it in an invalid state.
                    self.refs.spinner.value = formatTimecode(
                        self.props.timecode);
                }
            },
            spin: function(e, ui) {
                const seconds = ui.value / 100;
                if (isFinite(seconds)) {
                    self.props.onChange(seconds);
                }
                if (self.props.timecode !== self.refs.spinner.value) {
                    // Lock down the value on spin as well.
                    self.refs.spinner.value = formatTimecode(
                        self.props.timecode);
                    return false;
                }
            }
        });
    }
    componentWillUnmount() {
        jQuery(this.refs.spinner).timecodespinner('destroy');
    }
}

TimecodeEditor.propTypes = {
    min: PropTypes.number.isRequired,
    timecode: PropTypes.number.isRequired
};
