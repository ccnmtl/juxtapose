import React from 'react';
import Track from './Track.jsx';
import CollectionAdder from './CollectionAdder.jsx';

export default class AuxTrack extends Track {
    renderItemAdder() {
        return <CollectionAdder
                   showing={this.state.adding}
                   onCloseClick={this.closeItemAdder.bind(this)}
                   collectionData={this.props.collectionData}
                   onSubmit={this.onTrackItemAdd.bind(this)} />;
    }
}
