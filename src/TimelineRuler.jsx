import React from 'react';
import {formatTimecode} from './utils.js';


export default class TimelineRuler extends React.Component {
    /**
     * Takes the visual offset as a percentage, and the position
     * in seconds. The position is used as the key, so it must
     * be unique in the component it's used in.
     *
     * Returns an array containing the label and the tick.
     */
    generateTick(visualOffset, position, final) {
        let labelStyle = {left: visualOffset + '%'};
        if (final) {
            labelStyle = {right: 0};
        }

        return [
            <div key={position + '-label'}
                 className="jux-timeline-ticklabel"
                 style={labelStyle}>
                {formatTimecode(position)}
            </div>,
            <div key={position}
                 className="jux-timeline-tick"
                 style={{left: visualOffset + '%'}}
            ></div>
        ];
    }
    generateTicks(duration) {
        // Generate a tick for every 30 seconds.
        let tickOffset = 30;
        if (duration > 300) {
            tickOffset = 60;
        } else if (duration > 900) {
            tickOffset = 120;
        }

        let ticks = [];
        let i = 0;
        // Generate ticks up until we're within 8% of the end
        for (; i < (duration - (duration * 0.08)); i += tickOffset) {
            let visualOffset = (i / duration) * 100;
            ticks = ticks.concat(this.generateTick(visualOffset, i, false));
        }

        // Generate final tick
        ticks = ticks.concat(this.generateTick(100, duration, true));

        return ticks;
    }
    render() {
        return <div className="jux-timeline-ruler">
            <div className="jux-timeline-hline"></div>
            {this.generateTicks(this.props.duration)}
        </div>;
    }
}
