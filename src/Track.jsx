import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import TrackItem from './TrackItem.jsx';
import TrackItemAddColumn from './TrackItemAddColumn.jsx';
import GridItem from 'react-grid-layout';

/**
 * Scale percentage to track x co-ordinate (0 to 1000).
 */
function percentToTrackCoords(n) {
    return n * 10;
}

/**
 * Returns true if the item at the given track type and index is active.
 */
function isActive(activeItem, type, i) {
    if (activeItem &&
        activeItem[0] === type &&
        parseInt(activeItem[1], 10) === i
    ) {
        return true;
    }
    return false;
}


export default class Track extends React.Component {
    constructor() {
        super();
        this.state = {
            adding: false
        };
        this.width = 600;
    }
    generateItems() {
        let items = [];
        const me = this;
        this.props.data.map(function(data, i) {
            if (me.props.duration) {
                const width = percentToTrackCoords(
                    ((data.endTime - data.startTime) / me.props.duration)
                    * 100);
                const percent = (data.startTime / me.props.duration) * 100;
                const xPos = percentToTrackCoords(percent);
                const active = isActive(me.props.activeItem, me.type, i);

                const item = <TrackItem
                                 isActive={active}
                                 key={i}
                                 data={data}
                                 data-grid={{
                                     x: xPos,
                                     y: 0,
                                     w: width,
                                     h: 9
                                 }}
                                 duration={data.duration} />;
                items.push(item);
            }
        });
        return items;
    }
    generateSnapColumns() {
        let columns = [];
        for (let i = 0; i < (this.width / 10); i++) {
            columns.push(
                <TrackItemAddColumn
                    key={i}
                    idx={i}
                    callbackParent={this.onAddTrackItemClick.bind(this)} />
            );
        }
        return columns;
    }
    onAddTrackItemClick() {
        this.setState({adding: true});
    }
    onTrackItemAdd(value, timestamp) {
        this.closeItemAdder();
        this.props.onTrackItemAdd(value, timestamp);
    }
    closeItemAdder() {
        this.setState({adding: false});
    }
    renderItemAdder() {
        return null;
    }
    render() {
        const duration = this.props.duration;
        return <div className="jux-track">
                    {this.renderItemAdder()}
                    {this.generateSnapColumns()}
                    <ReactGridLayout
                        width={this.width}
                        margin={[0,10]}
                        className="layout react-grid-layout"
                        cols={1000}
                        onDragStop={this.props.onDragStop}
                        onClick={this.onClick}
                        maxRows={1}
                        rowHeight={1}>
                        {this.generateItems()}
                    </ReactGridLayout>
        </div>;
    }
}
