import React from 'react';
import {formatDuration} from './utils.js';


export default class TimelineRuler extends React.Component {
    generateTicks(duration) {
        // Generate a tick for every 30 seconds.
        let ticks = [];
        for (let i = 0; i < duration; i += 30) {
            let visualOffset = (i / duration) * 100;
            ticks.push(
                <div key={visualOffset + '-label'}
                     className="jux-timeline-ticklabel"
                     style={{left: visualOffset + '%'}}>
                    {formatDuration(i)}
                </div>
            );
            ticks.push(
                <div key={visualOffset}
                     className="jux-timeline-tick"
                     style={{left: visualOffset + '%'}}
                ></div>
            );
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
