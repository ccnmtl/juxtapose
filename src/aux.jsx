import React from 'react';
import {Track} from './track.jsx';
import {auxTrackData} from './data.js';

export class AuxTrack extends Track {
    constructor() {
        super();
        this.state = {data: auxTrackData};
    }
}

export class AuxMedia extends React.Component {
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
