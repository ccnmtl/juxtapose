import React from 'react';

export default class PlayButton extends React.Component {
    onClick(event) {
        this.props.onClick(event);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.onClick.bind(this)}>
            {this.props.isPlaying ?
             String.fromCharCode(9208) :
             String.fromCharCode(9654) }
        </button>;
    }
}
