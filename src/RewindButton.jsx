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
             <span className="glyphicon glyphicon-step-backward"
                   title="Rewind"></span>
        </button>;
    }
}

RewindButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    time: PropTypes.number.isRequired
};
