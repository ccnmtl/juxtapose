import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import TrackElement from './TrackElement.jsx';
import TrackElementAddColumn from './TrackElementAddColumn.jsx';

/**
 * Scale percentage to track x co-ordinate (0 to 1000).
 */
function percentToTrackCoords(n) {
    return n * 10;
}

/**
 * Returns true if the item at the given track type and index is active.
 */
function isActive(activeElement, type, i) {
    if (activeElement &&
        activeElement[0] === type &&
        parseInt(activeElement[1], 10) === i
    ) {
        return true;
    }
    return false;
}


export default class Track extends React.Component {
    constructor(props) {
        super(props);
        this.width = 910;
    }
    generateItems(trackData) {
        let items = [];
        const me = this;
        trackData.map(function(data, i) {
            if (!me.props.duration) {
                return;
            }
            const width = percentToTrackCoords(
                ((data.end_time - data.start_time) / me.props.duration)
                * 100);
            const percent = (data.start_time / me.props.duration) * 100;
            const xPos = percentToTrackCoords(percent);
            const active = isActive(me.props.activeElement, me.type, i);

            const item = <TrackElement
                             onEditButtonClick={me.onEditButtonClick.bind(me)}
                             isActive={active}
                             key={i}
                             data={data}
                             data-grid={{
                                 x: xPos,
                                 y: 0,
                                 w: width,
                                 h: 49
                             }} />;
            items.push(item);
        });
        return items;
    }
    generateSnapColumns() {
        let columns = [];
        let n = this.width / 10;
        let duration = this.props.duration / n;
        for (let i = 0; i < n; i++) {
            let timecode = duration * i;
            columns.push(
                <TrackElementAddColumn
                    key={i}
                    idx={i}
                    absoluteTimecode={timecode}
                    callbackParent={this.onAddTrackElementClick.bind(this)} />
            );
        }
        return columns;
    }
    onEditButtonClick(e, item) {
        this.props.onTrackEditButtonClick(e, item);
    }
    closeItemAdder() {
        this.setState({adding: false});
    }
    renderItemAdder() {
        return null;
    }
    render() {
        const cssClasses = "jux-track-container jux-" + this.type;
        const displayHelpTxt =
            this.props.data.length === 0 ? 'block': 'none';

        return <div className={cssClasses}>
                    <div className="track-icon"></div>
                <div className="jux-track">
                    <div className="jux-track-instructions"
                        style={{'display': displayHelpTxt}}>
                        {this.helpText}
                    </div>
                    {this.renderItemAdder()}
                    {this.generateSnapColumns()}
                    <ReactGridLayout
                        width={this.width}
                        margin={[0,0]}
                        className="layout react-grid-layout"
                        cols={1000}
                        onDragStop={this.props.onDragStop}
                        onClick={this.onClick}
                        maxRows={1}
                        rowHeight={1}
                        autoSize={false}
                        isResizable={false}
                        preventCollision={true}>
                        {this.generateItems(this.props.data)}
                    </ReactGridLayout>
            </div>
        </div>;
    }
    onAddWithoutPrimaryVid() {
        this.props.onAddWithoutPrimaryVid();
    }
}

Track.propTypes = {
    data: React.PropTypes.array.isRequired,
    duration: React.PropTypes.number,
    onAddWithoutPrimaryVid: React.PropTypes.func,
    onDragStop: React.PropTypes.func.isRequired,
    onTrackEditButtonClick: React.PropTypes.func.isRequired
};
