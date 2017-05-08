import React from 'react';
import PropTypes from 'prop-types';
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
        if (duration > 300 && duration <= 900) {
            tickOffset = 60;
        } else if (duration > 900 && duration <= 1800) {
            tickOffset = 120;
        } else if (duration > 1800) {
            // Round to nearest 10, based on the duration.
            tickOffset = Math.round(duration * 0.15 / 10) * 10;
        }

        let ticks = [];
        let i = 0;
        // Generate ticks up until we're within 8% of the end
        for (; i < (duration - (duration * 0.08)); i += tickOffset) {
            let visualOffset = (i / duration) * 100;
            ticks.push([visualOffset, i]);
        }

        // Generate final tick
        ticks.push([100, duration]);

        return ticks;
    }
    generateTicksElements(duration) {
        let self = this;

        const ticks = this.generateTicks(duration);
        let elements = [];
        ticks.forEach(function(v, i) {
            elements.push(
                self.generateTick(
                    v[0],
                    v[1],
                    i === (ticks.length - 1)));
        });
        return elements;
    }
    render() {
        const ticks = this.generateTicksElements(this.props.duration);
        const hoverClass = this.props.hovering ?
                           'jux-timeline-ruler hover' :
                           'jux-timeline-ruler';
        return <div className={hoverClass}>
            <div className="jux-timeline-hline"></div>
            {ticks}
        </div>;
    }
}

TimelineRuler.propTypes = {
    duration: PropTypes.number,
    hovering: PropTypes.bool.isRequired
};
