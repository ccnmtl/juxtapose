import React from 'react';
import Track from './Track.jsx';
import TextAnnotationAdder from './TextAnnotationAdder.jsx';

export default class TextTrack extends Track {
    constructor(props) {
        super(props);
        this.type = 'txt';
        this.state = {
            adding: false,
            timecode: 0
        };
    }
    renderItemAdder() {
        return <TextAnnotationAdder
                   showing={this.state.adding}
                   onCloseClick={this.closeItemAdder.bind(this)}
                   onSubmit={this.onTrackElementAdd.bind(this)} />;
    }
    // When the add button is clicked (open modal)
    onAddTrackElementClick(e, absoluteTimecode) {
        this.setState({
            adding: true,
            timecode: absoluteTimecode
        });
    }
    // When the new element is actually added
    onTrackElementAdd(value) {
        this.closeItemAdder();
        this.props.onTrackElementAdd(value, this.state.timecode);
    }
    getHelpText() {
        return "Click on this track to place text elements";
    }
}
