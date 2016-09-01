import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import TrackItem from './TrackItem.jsx';
import GridItem from 'react-grid-layout';

export default class Track extends React.Component {
    /**
     * Scale percentage to track x co-ordinate (0 to 1000).
     */
    percentToTrackCoords(n) {
        return n * 10;
    }
    generateItems() {
        let items = [];
        const me = this;
        this.props.data.map(function(data, i) {
            if (me.props.duration) {
                const width = me.percentToTrackCoords(
                    ((data.endTime - data.startTime) / me.props.duration)
                    * 100);
                const percent = (data.startTime / me.props.duration) * 100;
                const xPos = me.percentToTrackCoords(percent);
                const item = <TrackItem
                                 key={i}
                                 data={data}
                                 data-grid={{
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
        const duration = this.props.duration;
        return <ReactGridLayout
                   width={600}
                   margin={[0,10]}
                   className="layout jux-track react-grid-layout"
                   cols={1000}
                   draggableCancel=".jux-stretch-handle"
                   onDragStop={this.props.onDragStop}
                   maxRows={1}
                   rowHeight={1}>
                {this.generateItems()}
            </ReactGridLayout>;
    }
}
