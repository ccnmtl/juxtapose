import React from 'react';

export default class TextDisplay extends React.Component {
    shouldDisplay(data, currentTime) {
        for (let e of data) {
            if (currentTime >= e.start_time &&
                currentTime <= e.end_time) {
                return e.source;
            }
        }
        return '';
    }
    render() {
        const txt = this.shouldDisplay(this.props.data, this.props.time);
        return <div className="jux-text-display-container"><div className="jux-text-display">{txt}</div></div>;
    }
}

TextDisplay.propTypes = {
    data: React.PropTypes.object.isRequired,
    time: React.PropTypes.number.isRequired
};
