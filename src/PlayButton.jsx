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
                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
               </svg> :
               <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
               </svg>}
        </button>;
    }
}

PlayButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired
};
