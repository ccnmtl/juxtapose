import React from 'react';

export default class TrackElementAddColumn extends React.Component {
    onClick(e) {
        this.props.callbackParent(e);
    }
    render() {
        return <div className="jux-snap-column"
                    onClick={this.onClick.bind(this)}
               ></div>;
    }
}
