import React from 'react';
import Track from './Track.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';

export default class MediaTrack extends Track {
    constructor() {
        super();
        this.type = 'media';
    }
    onAddTrackElementClick() {
        createCollectionWidget();
    }
}
