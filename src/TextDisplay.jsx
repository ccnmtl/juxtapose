import React from 'react';
import {textTrackData} from './data.js';

export default class TextDisplay extends React.Component {
    shouldDisplay(data, currentTime) {
        for (let e of data) {
            if (currentTime >= e.start_time &&
                currentTime <= e.end_time) {
                return e.source;
            }
        }
        return '';
    }
    render() {
        const txt = this.shouldDisplay(textTrackData, this.props.time);
        return <div className="jux-text-display">{txt}</div>;
    }
}
