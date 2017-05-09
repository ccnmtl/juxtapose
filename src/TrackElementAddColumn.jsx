import React from 'react';
import PropTypes from 'prop-types';

export default class TrackElementAddColumn extends React.Component {
    onClick(e) {
        this.props.callbackParent(e, this.props.absoluteTimecode);
    }
    render() {
        return <div className="jux-snap-column"
                    onClick={this.onClick.bind(this)}
               ></div>;
    }
}

TrackElementAddColumn.propTypes = {
    absoluteTimecode: PropTypes.number.isRequired,
    callbackParent: PropTypes.func.isRequired
};
