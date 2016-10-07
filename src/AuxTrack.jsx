import React from 'react';
import Track from './Track.jsx';
import {createCollectionList} from './collectionList.js';

export default class AuxTrack extends Track {
    constructor() {
        super();
        this.type = 'aux';
    }
    onAddTrackElementClick() {
        createCollectionList();
    }
}
