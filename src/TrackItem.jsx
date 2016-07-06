import React from 'react';

export default class TrackItem extends React.Component {
    render() {
        var style = {};
        if (this.props.duration) {
            var ratio = this.props.data.startTime / this.props.duration;
            var pos = ratio * 600;
            var wRatio = (this.props.data.endTime -
                          this.props.data.startTime) / this.props.duration;
            var width = wRatio * 600;
            style = {
                left: pos + 'px',
                width: width + 'px'
            };
        }
        return <div data={this.props.data}
                    className={this.props.className}
                    style={this.props.style}
                    onMouseDown={this.props.onMouseDown}
                    onMouseUp={this.props.onMouseUp}
                    onTouchEnd={this.props.onTouchEnd}
                    onTouchStart={this.props.onTouchStart}>
            <div className="jux-stretch-handle jux-aux-item-left"></div>
            {this.props.data.type === 'vid' ? <video className="aux-item-middle">
                <source src={this.props.data.source} type="video/mp4" />
            </video> : null}
            {this.props.data.type === 'img' ? <img className="aux-item-middle"
                                                   src={this.props.data.source} /> : null}
            {this.props.data.type === 'txt' ? <p className="aux-item-middle">
                {this.props.data.source}</p> : null}
            <span className="react-resizable-handle"></span>
            <div className="jux-stretch-handle jux-aux-item-right"></div>
        </div>;
    }
}
