import React from 'react';

export default class VidItemThumb extends React.Component {
    render() {
        return <div className="jux-vid-item-thumb" style={{
            backgroundImage: 'url(' + this.props.url + ')'
        }}></div>;
    }
}

VidItemThumb.propTypes = {
    url: React.PropTypes.string.isRequired
};
