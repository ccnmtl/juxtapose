import React from 'react';
import Track from './Track.jsx';

export class AuxTrack extends Track {
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
        const vid = this.el;
        vid.currentTime = 5.333;
    }
    play() {
        this.el.play();
    }
    pause() {
        this.el.pause();
    }
}
