import React from 'react';

export default class PlayButton extends React.Component {
    onClick(event) {
        this.props.onClick(event);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.onClick.bind(this)}>
            {this.props.isPlaying ?
                <span className="glyphicon glyphicon-pause"></span> :
                <span className="glyphicon glyphicon-play"></span>}
        </button>;
    }
}
