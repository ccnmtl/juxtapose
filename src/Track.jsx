import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import TrackItem from './TrackItem.jsx';

export default class Track extends React.Component {
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
                   margin={[0,10]}
                   className="layout jux-track react-grid-layout"
                   cols={1000}
                   draggableCancel=".jux-stretch-handle"
                   onDragStop={this.props.onDragStop}
                   rowHeight={1}>
                {this.generateItems()}
            </ReactGridLayout>;
    }
}
