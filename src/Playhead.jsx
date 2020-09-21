import React from 'react';
import PropTypes from 'prop-types';

export default class Playhead extends React.Component {
    constructor(props) {
        super(props);
        this.trackWidth = 915;
    }
    render() {
        if (!this.props.duration) {
            return <div className="jux-playhead-container">
    <div className="jux-playhead-line" style={{opacity: 0}}></div>
            </div>;
        }

        let currentPos = 0;
        if (this.props.duration !== 0) {
            currentPos = (this.props.currentTime / this.props.duration);
        }

        const x = this.trackWidth * currentPos;
        const lineStyle = {left: x + 7 + 'px'};

        return <div className="jux-playhead-container">
            <input type="range" min="0" max="1000" aria-label="range"
                   ref={(ref) => this.el = ref}
                   onChange={this.props.onChange}
                   onMouseDown={this.props.onMouseDown}
                   onMouseUp={this.props.onMouseUp}
                   onMouseEnter={this.props.onMouseEnter}
                   onMouseLeave={this.props.onMouseLeave}
                   value={currentPos * 1000} />
            <div className="jux-playhead-line" style={lineStyle}></div>
        </div>;
    }
}

Playhead.propTypes = {
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
};
