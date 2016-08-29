import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import TrackItem from './TrackItem.jsx';
import GridItem from 'react-grid-layout';

export default class Track extends React.Component {
    constructor() {
        super();
        // FIXME: I can't figure out how to access the GridLayout
        // or GridItem's dragging state from within the TrackItem,
        // so I'm creating my own here.
        this.state = {dragging: false};
    }
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
                                 dragging={me.state.dragging}
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
    onDrag(e) {
        this.setState({dragging: true});
    }
    render() {
        const duration = this.props.duration;
        return <ReactGridLayout
                   width={600}
                   margin={[0,10]}
                   className="layout jux-track react-grid-layout"
                   cols={1000}
                   draggableCancel=".jux-stretch-handle"
                   onDrag={this.onDrag.bind(this)}
                   onDragStop={this.props.onDragStop}
                   maxRows={1}
                   rowHeight={1}>
                {this.generateItems()}
            </ReactGridLayout>;
    }
}
