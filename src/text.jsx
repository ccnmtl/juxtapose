import React from 'react';
import Track from './Track.jsx';
import {textTrackData} from './data.js';

export class TextTrack extends Track {
    initAddTrackItem() {
        console.log('add text item');
    }
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
        const txt = this.shouldDisplay(textTrackData, this.props.time);
        return <div className="jux-text-display">{txt}</div>;
    }
}
