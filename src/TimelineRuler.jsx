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
    generateTick(visualOffset, position) {
        return [
            <div key={position + '-label'}
                 className="jux-timeline-ticklabel"
                 style={{left: visualOffset + '%'}}>
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
        for (; i < duration; i += tickOffset) {
            let visualOffset = (i / duration) * 100;
            ticks = ticks.concat(this.generateTick(visualOffset, i));
        }
        // If the last tick is more than 5 seconds before the end, generate
        // one for the end.
        if (duration - (i - tickOffset) > 5) {
            ticks = ticks.concat(this.generateTick(100, duration));
        }
        return ticks;
    }
    render() {
        return <div className="jux-timeline-ruler">
            <div className="jux-timeline-hline"></div>
            {this.generateTicks(this.props.duration)}
        </div>;
    }
}
