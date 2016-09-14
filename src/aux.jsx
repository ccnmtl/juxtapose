import React from 'react';
import Track from './Track.jsx';

export class AuxTrack extends Track {
    initAddTrackItem() {
        console.log('TODO: open mediathread collection view');
    }
}

export class AuxDisplay extends React.Component {
    constructor() {
        super()
        this.id = 'jux-aux-video';
    }
    renderVideo(data) {
        return <video id={this.id}
                      ref={(ref) => this.el = ref}
                      width="297">
            <source src="wildspot.mp4" type="video/mp4" />
            <source src="wildspot.webm" type="video/webm" />
            <source src="wildspot.ogv"
                    type='video/ogg; codecs="theora, vorbis"' />

        </video>;
    }
    renderImage(data) {
        return <img src={data.source} />;
    }
    nowDisplay(data, currentTime) {
        for (let e of data) {
            if (currentTime >= e.startTime &&
                currentTime <= e.endTime) {
                if (e.type === 'vid') {
                    return this.renderVideo(e);
                } else {
                    return this.renderImage(e);
                }
            }
        }
        return '';
    }
    render() {
        let c = this.nowDisplay(this.props.data, this.props.time);
        return <div className="jux-aux-display">{c}</div>;
    }
    componentDidMount() {
        const el = this.el;
        if (el && el.currentTime) {
            el.currentTime = 5.333;
        }
    }
    play() {
        this.el.play();
    }
    pause() {
        this.el.pause();
    }
}
