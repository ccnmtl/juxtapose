import React from 'react';

export default class PlayButton extends React.Component {
    onClick(event) {
        this.props.onClick(event);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.onClick.bind(this)}>
            {this.props.playing ?
                <span className="glyphicon glyphicon-pause"></span> :
                <span className="glyphicon glyphicon-play"></span>}
        </button>;
    }
}

PlayButton.propTypes = {
    onClick: React.PropTypes.func.isRequired,
    playing: React.PropTypes.bool.isRequired
};
