import React from 'react';
import Track from './Track.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';

export default class MediaTrack extends Track {
    constructor(props) {
        super(props);
        this.type = 'media';
        this.helpText = "Click on this track to place video and " +
                        "audio elements";
    }
    onAddTrackElementClick(e, absoluteTimecode) {
        if (!this.props.primaryVid) {
            this.onAddWithoutPrimaryVid();
            return;
        }
        const caller = {
            'type': 'track',
            'timecode': absoluteTimecode
        };
        createCollectionWidget('all', false, caller);
    }
    getHelpText() {
        return "Click on this track to place video and audio elements";
    }
}
