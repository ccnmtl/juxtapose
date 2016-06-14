//import { DragSource } from 'react-dnd';

import React from 'react';

class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
        this.state = {duration: null};
    }
    render() {
        return <div><video id={this.id} width="297">
            <source src="wildspot.mp4" type="video/mp4" />
            <source src="wildspot.ogv" type='video/ogg; codecs="theora, vorbis"' />
            </video></div>;
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

class AuxMedia extends React.Component {
    constructor() {
        super()
        this.id = 'jux-aux-video';
        this.state = {};
    }
    render() {
        return <div><video id={this.id} width="297">
            <source src="wildspot.mp4" type="video/mp4" />
            <source src="wildspot.ogv" type='video/ogg; codecs="theora, vorbis"' />
            </video></div>;
    }
    componentDidMount() {
        var vid = document.getElementById(this.id);
        vid.currentTime = 3;
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
        this.setState({play: newState})
        this.props.callbackParent(newState);
        this.__html = 'abc';
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
    componentDidMount() {
    }
}

class AuxTrack extends React.Component {
    render() {
        return <div className="jux-track"></div>;
    }
}

class Playhead extends React.Component {
    render() {
        return <div className="jux-playhead" onMouseDown={this.onMouseDown}>
            <div className="cutpoint-top"></div>
            <div className="cutpoint-bottom"></div>
            </div>;
    }
    onMouseDown() {
        console.log('mousedown!');
    }
}

class Timeline extends React.Component {
    render() {
        return <div className="jux-sequencer">
            <Playhead />
            <SpineTrack />
            <AuxTrack />
            </div>;
    }
}

class ExampleApplication extends React.Component {
    render() {
        return <div className="jux-container">
            <div className="vid-container">
            <SpineVideo ref={(c) => this._spineVid = c} />
            <AuxMedia ref={(c) => this._auxVid = c} />
            </div>
            <PlayButton callbackParent={this.onPlayChanged.bind(this)} />
            <Timeline />
            </div>;
    }
    onPlayChanged (newState) {
        if (newState) {
            this._spineVid.play();
            this._auxVid.play();
        } else {
            this._spineVid.pause();
            this._auxVid.pause();
        }
    }
}

ReactDOM.render(
    <ExampleApplication />,
    document.getElementById('container')
);
