import React from 'react';
import {Track} from './track.jsx';
import {textTrackData} from './data.js';

export class TextTrack extends Track {
    constructor() {
        super();
        this.state = {data: textTrackData};
    }
}

export class TextDisplay extends React.Component {
    render() {
        return <p>Text Area {this.props.time}</p>;
    }
}
