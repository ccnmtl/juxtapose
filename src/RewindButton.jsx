import React from 'react';
import PropTypes from 'prop-types';

export default class RewindButton extends React.Component {
    onClick(event) {
        this.props.onClick(event);
    }
    render() {
        let disabled = false;
        if (this.props.time === 0) {
            disabled = true;
        }

        const cls = disabled ? 'jux-rewind disabled' : 'jux-rewind';
        return <button className={cls}
                       disabled={disabled}
                       onClick={this.onClick.bind(this)}>
                       <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                        <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                      </svg>
               </button>;
    }
}

RewindButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    time: PropTypes.number.isRequired
};
