import React from 'react';
import PropTypes from 'prop-types';
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

// Need to use a forwardRef when using a custom component as a react
// grid item.
// See:
// https://github.com/react-grid-layout/react-grid-layout/issues/1241#issuecomment-859651584
// eslint-disable-next-line
const TrackElementRef = React.forwardRef(
    // eslint-disable-next-line
    ({style, className, key, children, ...restOfProps}) => {
    return <TrackElement
               style={style}
               className={className}
               key={key}
               {...restOfProps}>
               {children}
           </TrackElement>;
});

TrackElementRef.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.array
};


export default class Track extends React.Component {
    constructor(props) {
        super(props);
        this.width = 910;
    }
    // TODO: generateLayout / generateItems logic is identical, and
    // could be merged.
    generateLayout(trackData) {
        let layout = [];
        const me = this;
        trackData.map(function(data) {
            if (!me.props.duration ||
                // In case of bad track data, it's possible that the
                // track item's start time could be greater than the
                // spine's duration. Track items like this just
                // shouldn't be displayed.
                data.start_time > me.props.duration
               ) {
                return;
            }

            // A similar fix for bad track data: track items that
            // have a start time within a valid range, but an out
            // of bounds end time should just be capped to the valid
            // range.
            const itemLen = Math.min(
                data.end_time - data.start_time,
                me.props.duration);

            const width = percentToTrackCoords(
                (itemLen / me.props.duration) * 100);

            const percent = (data.start_time / me.props.duration) * 100;
            const xPos = percentToTrackCoords(percent);

            const item = {
                x: xPos,
                y: 0,
                w: width,
                h: 49
            };
            layout.push(item);
        });
        return layout;
    }
    generateItems(trackData) {
        let items = [];
        const me = this;
        trackData.map(function(data, i) {
            if (!me.props.duration ||
                // In case of bad track data, it's possible that the
                // track item's start time could be greater than the
                // spine's duration. Track items like this just
                // shouldn't be displayed.
                data.start_time > me.props.duration
               ) {
                return;
            }

            // A similar fix for bad track data: track items that
            // have a start time within a valid range, but an out
            // of bounds end time should just be capped to the valid
            // range.
            const itemLen = Math.min(
                data.end_time - data.start_time,
                me.props.duration);

            const width = percentToTrackCoords(
                (itemLen / me.props.duration) * 100);

            const percent = (data.start_time / me.props.duration) * 100;
            const xPos = percentToTrackCoords(percent);
            const active = isActive(me.props.activeElement, me.type, i);

            const item = <TrackElementRef
                             onEditButtonClick={me.onEditButtonClick.bind(me)}
                             isActive={active}
                             key={i}
                             data={data}
                             data-grid={{
                                 x: xPos,
                                 y: 0,
                                 w: width,
                                 h: 49
                             }}
                         />;

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
                        layout={this.generateLayout(this.props.data)}
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
    data: PropTypes.array.isRequired,
    duration: PropTypes.number,
    onAddWithoutPrimaryVid: PropTypes.func,
    onDragStop: PropTypes.func.isRequired,
    onTrackEditButtonClick: PropTypes.func.isRequired
};
