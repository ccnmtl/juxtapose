import React from 'react';
import Track from './Track.jsx';
import TextAnnotationAdder from './TextAnnotationAdder.jsx';

export default class TextTrack extends Track {
    constructor(props) {
        super(props);
        this.type = 'txt';
    }
    renderItemAdder() {
        return <TextAnnotationAdder
                   showing={this.state.adding}
                   onCloseClick={this.closeItemAdder.bind(this)}
                   onSubmit={this.onTrackElementAdd.bind(this)} />;
    }
}
