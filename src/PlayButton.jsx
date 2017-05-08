import React from 'react';
import PropTypes from 'prop-types';

export default class PlayButton extends React.Component {
    onClick(event) {
        this.props.onClick(event);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.onClick.bind(this)}>
            {this.props.playing ?
             <span className="glyphicon glyphicon-pause"
                   title="Pause"></span> :
             <span className="glyphicon glyphicon-play"
                   title="Play"></span>}
        </button>;
    }
}

PlayButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired
};
