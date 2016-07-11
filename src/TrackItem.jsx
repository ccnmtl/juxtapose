import React from 'react';

export default class TrackItem extends React.Component {
    calcStyle() {
        const trackWidth = 600;
        const ratio = this.props.data.startTime / this.props.duration;
        const pos = ratio * trackWidth;
        const wRatio = (this.props.data.endTime -
                        this.props.data.startTime) / this.props.duration;
        const width = wRatio * trackWidth;
        return {
            left: pos + 'px',
            width: width + 'px'
        };
    }
    render() {
        let style = {};
        if (this.props.duration) {
            style = this.calcStyle();
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
