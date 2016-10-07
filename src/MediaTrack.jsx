import React from 'react';
import Track from './Track.jsx';
import {createCollectionList} from './collectionList.js';

export default class MediaTrack extends Track {
    constructor() {
        super();
        this.type = 'media';
    }
    onAddTrackElementClick() {
        createCollectionList();
    }
}
