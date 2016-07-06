import React from 'react';
import {Track} from './track.jsx';
import {textTrackData} from './data.js';

export class TextTrack extends Track {
}

export class TextDisplay extends React.Component {
    shouldDisplay(data, currentTime) {
        for (let e of data) {
            if (currentTime >= e.startTime &&
                currentTime <= e.endTime) {
                return e.source;
            }
        }
        return '';
    }
    render() {
        var txt = this.shouldDisplay(textTrackData, this.props.time);
        return <div className="jux-text-display">{txt}</div>;
    }
}
