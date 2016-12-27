import React from 'react';
import Track from './Track.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';

export default class MediaTrack extends Track {
    constructor(props) {
        super(props);
        this.type = 'media';
    }
    onAddTrackElementClick(e, absoluteTimecode) {
        let caller = {
            'type': 'track',
            'timecode': absoluteTimecode
        }
        createCollectionWidget('all', caller);
    }
    getHelpText() {
        return "Click on this track to place video and audio elements";
    }
}
