import React from 'react';
import ReactGridLayout from 'react-grid-layout';

class TrackItem extends React.Component {
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

export class Track extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    onResize(event) {
        console.log('resize');
    }
    /**
     * Scale percentage to track x co-ordinate (0 to 1000).
     */
    percentToTrackCoords(n) {
        return n * 10;
    }
    generateItems() {
        var items = [];
        var me = this;
        this.props.data.map(function(data, i) {
            if (me.props.duration) {
                var width = me.percentToTrackCoords(
                    ((data.endTime - data.startTime) / me.props.duration)
                    * 100);
                var percent = (data.startTime / me.props.duration) * 100;
                var xPos = me.percentToTrackCoords(percent);
                var item = <TrackItem
                               key={i}
                               data={data}
                               _grid={{
                                   x: xPos,
                                   y: 0,
                                   w: width,
                                   h: 10
                               }}
                               duration={data.duration} />;
                items.push(item);
            }
        });
        return items;
    }
    render() {
        var duration = this.props.duration;
        return <ReactGridLayout
                   {...this.props}
                   width={600}
                   className="layout jux-track react-grid-layout"
                   cols={1000}
                   draggableCancel=".jux-stretch-handle"
                   rowHeight={1}>
                {this.generateItems()}
            </ReactGridLayout>;
    }
}
