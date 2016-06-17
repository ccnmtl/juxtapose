import React from 'react';
import ReactDOM from 'react-dom';

function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function formatDuration(seconds) {
    var minutes = pad2(Math.floor(seconds / 60));
    var seconds = pad2(Math.round(seconds - minutes * 60));
    return minutes + ':' + seconds;
}

class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
        this.state = {duration: null, time: null};
    }
    render() {
        return <div>
            <video id={this.id}
                   width="297"
                   onTimeUpdate={this.handleTimeUpdate.bind(this)}>
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    handleTimeUpdate(v) {
        var vid = v.target
        var time = vid.currentTime;
        this.setState({time: time, duration: this.state.duration});
        this.props.callbackParent(time);
    }
    play() {
        var vid = document.getElementById(this.id);
        this.setState({time: vid.currentTime, duration: vid.duration});
        vid.play();
    }
    pause() {
        var vid = document.getElementById(this.id);
        vid.pause();
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
            <video id={this.id} width="297">
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    componentDidMount() {
        var vid = document.getElementById(this.id);
        vid.currentTime = 5.333;
    }
    play() {
        var vid = document.getElementById(this.id);
        vid.play();
    }
    pause() {
        var vid = document.getElementById(this.id);
        vid.pause();
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
        return <div className="jux-track"></div>;
    }
}

class AuxTrack extends React.Component {
    render() {
        return <div className="jux-track"></div>;
    }
}

class Playhead extends React.Component {
    constructor() {
        super();
        this.state = {time: 0, duration: null};
    }
    handleChange(event) {
        var percentDone = this.state.duration * (event.target.value / 100);
        this.setState({time: percentDone, duration: this.state.duration});
    }
    render() {
        var percentDone = 0;
        if (this.state.duration !== 0) {
            percentDone = (this.state.time / this.state.duration) * 100;
        }
        return <input type="range" min="0" max="1000"
                      onChange={this.handleChange.bind(this)}
                      value={percentDone} />;
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
            <PlayButton callbackParent={this.onPlayChanged.bind(this)} />
            <div className="jux-time">
                {formatDuration(this.state.time)} / {formatDuration(this.state.duration)}
            </div>
            <div className="jux-timeline">
                <Playhead ref={(c) => this._playhead = c} />
                <SpineTrack />
                <AuxTrack />
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
    onTimeUpdate (time) {
        this._playhead.setState({
            time: time,
            duration: this._spineVid.state.duration
        });
        this.setState({
            time: time,
            duration: this._spineVid.state.duration
        });
    }
}

ReactDOM.render(
    <JuxtaposeApplication />,
    document.getElementById('container')
);
