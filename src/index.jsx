import React from 'react';
import ReactDOM from 'react-dom';
import ReactGridLayout from 'react-grid-layout';

function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function formatDuration(seconds) {
    var minutes = pad2(Math.floor(seconds / 60));
    var seconds = pad2(Math.round(seconds - minutes * 60));
    return minutes + ':' + seconds;
}

var auxTrackData = [
    {
        key: 1,
        startTime: 1,
        endTime: 37,
        type: 'vid',
        source: 'wildspot.mp4'
    },
    {
        key: 2,
        startTime: 38,
        endTime: 40,
        type: 'img',
        source: 'img/image.jpg'
    },

];

var textTrackData = [
    {
        key: 1,
        startTime: 60,
        endTime: 70,
        type: 'txt',
        source: 'Some text!'
    }
];

class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
        this.state = {duration: null, time: null};
    }
    render() {
        return <div>
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297"
                   onTimeUpdate={this.handleTimeUpdate.bind(this)}
                   onLoadedMetadata={this.handleLoadedMetadata.bind(this)}
            >
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    updateVidPosition(time) {
        this.el.currentTime = time;
    }
    handleLoadedMetadata(e) {
        var vid = e.target;
        this.setState({time: vid.currentTime, duration: vid.duration});
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    handleTimeUpdate(e) {
        var vid = e.target;
        this.setState({time: vid.currentTime, duration: this.state.duration});
        this.props.callbackParent(vid.currentTime, this.state.duration);
    }
    // TODO: handle playback finish event
    play() {
        var vid = this.el;
        this.setState({time: vid.currentTime, duration: vid.duration});
        vid.play();
    }
    pause() {
        this.el.pause();
    }
}

class AuxMedia extends React.Component {
    constructor() {
        super()
        this.id = 'jux-aux-video';
        this.state = {};
    }
    render() {
        return <div>
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297">
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    componentDidMount() {
        var vid = this.el;
        vid.currentTime = 5.333;
    }
    play() {
        this.el.play();
    }
    pause() {
        this.el.pause();
    }
}

class TextDisplay extends React.Component {
    render() {
        return <p>Text Area</p>;
    }
}

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {play: false};
    }
    handleClick(event) {
        var newState = !this.state.play;
        this.setState({play: newState});
        this.props.callbackParent(newState);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.handleClick.bind(this)}>
            {this.state.play ?
             String.fromCharCode(9208) :
             String.fromCharCode(9654) }
        </button>;
    }
}

class SpineTrack extends React.Component {
    render() {
        return <div className="jux-track">Spine Track</div>;
    }
}

class MediaPopup extends React.Component {
    render() {
        return <div className="jux-popup"
                    ref={(ref) => this.el = ref}
                    onClick={this.handlePopupClick.bind(this)}>
            Mediathread Collection
            <button className="jux-close"
                    onClick={this.closePopup.bind(this)}>X</button>
        </div>;
    }
    handlePopupClick(event) {
        event.stopPropagation();
    }
    openPopup(event) {
        var x = event.clientX - this.el.offsetLeft;
        this.el.style.left = x + 'px';
        this.el.style.visibility = 'visible';
    }
    closePopup(event) {
        event.stopPropagation();
        this.el.style.visibility = 'hidden';
    }
}

class AuxItem extends React.Component {
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
        return <div {...this.props}>
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

class AuxTrack extends React.Component {
    constructor() {
        super();
        this.state = {data: auxTrackData};
    }
    onResize(event) {
        console.log('resize');
    }
    generateItems() {
        var items = [];
        this.state.data.map(function(data, i) {
            var item = <AuxItem
                           key={i}
                           data={data}
                           _grid={{
                               x: data.startTime * 10,
                               y: 0,
                               w: 1,
                               h: 10
                           }}
                           duration={data.duration} />;
            items.push(item);
        });
        return items;
    }
    render() {
        var duration = this.props.duration;
        return <ReactGridLayout
                   {...this.props}
                   width={1000}
                   className="layout jux-track react-grid-layout"
                   cols={1000}
                   draggableCancel=".jux-stretch-handle"
                   rowHeight={1}>
                {this.generateItems()}
            </ReactGridLayout>;
    }
}

class TextTrack extends AuxTrack {
    constructor() {
        super();
        this.state = {data: textTrackData};
    }
}

class Playhead extends React.Component {
    constructor() {
        super();
        this.state = {time: 0, duration: null};
    }
    handleChange(event) {
        var percentDone = event.target.value / 1000;
        var newTime = this.state.duration * percentDone;
        this.setState({
            time: newTime,
            duration: this.state.duration
        });
        this.props.callbackParent(newTime, this.state.duration);
    }
    render() {
        var currentPos = 0;
        if (this.state.duration !== 0) {
            currentPos = (this.state.time / this.state.duration);
        }

        var clientWidth = this.el ? this.el.clientWidth : 0;
        var offsetLeft = this.el ? this.el.offsetLeft : 0;
        var x = clientWidth * currentPos + offsetLeft;
        var lineStyle = {left: x + 'px'};

        return <div>
            <div
                ref={(ref) => this._line = ref}
                className="jux-playhead-line"
                style={lineStyle}>
                <div className="jux-playhead-top-cutpoint"></div>
                <div className="jux-playhead-bottom-cutpoint"></div>
            </div>
            <input type="range" min="0" max="1000"
                   ref={(ref) => this.el = ref}
                   onChange={this.handleChange.bind(this)}
                   value={currentPos * 1000} />
        </div>;
    }
}

class JuxtaposeApplication extends React.Component {
    constructor() {
        super();
        this.state = {time: null, duration: null};
    }
    render() {
        return <div className="jux-container">
            <div className="vid-container">
                <SpineVideo
                    ref={(c) => this._spineVid = c}
                    callbackParent={this.onTimeUpdate.bind(this)}
                />
                <AuxMedia ref={(c) => this._auxVid = c} />
            </div>
            <TextDisplay />
            <PlayButton callbackParent={this.onPlayChanged.bind(this)} />
            <div className="jux-time">
                {formatDuration(this.state.time)} / {formatDuration(this.state.duration)}
            </div>
            <div className="jux-timeline">
                <Playhead ref={(c) => this._playhead = c}
                          callbackParent={this.onPlayheadUpdate.bind(this)} />
                <SpineTrack />
                <AuxTrack duration={this.state.duration} />
                <TextTrack duration={this.state.duration} />
            </div>
        </div>;
    }
    onPlayChanged(play) {
        if (play) {
            this._spineVid.play();
            this._auxVid.play();
        } else {
            this._spineVid.pause();
            this._auxVid.pause();
        }
    }
    onTimeUpdate(time, duration) {
        // TODO: this works for now, but I have a feeling this isn't the
        // right way to share state. Even if it is... the code is messy.
        var state = {
            time: time,
            duration: duration
        };
        this._playhead.setState(state);
        this.setState(state);
    }
    onPlayheadUpdate(time, duration) {
        var state = {
            time: time,
            duration: duration
        };
        this._spineVid.setState(state);
        this._spineVid.updateVidPosition(time);
        this.setState(state);
    }
}

ReactDOM.render(
    <JuxtaposeApplication />,
    document.getElementById('container')
);
