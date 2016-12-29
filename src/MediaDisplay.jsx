import React from 'react';
import SecondaryPlayer from './SecondaryPlayer.jsx';

/**
 * Derive the currently playing item given the current time
 * and the track state.
 */
export function getCurrentItem(data, currentTime) {
    for (let e of data) {
        if (currentTime >= e.start_time && currentTime <= e.end_time) {
            return e;
        }
    }
    return null;
}


export default class MediaDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.className = 'jux-media-video';
    }
    componentDidUpdate(props, state) {
        this.generatePlayers(props.data);
    }
    generatePlayers(mediaTrack) {
        this.players = [];
        const self = this;
        for (let i = 0; i < mediaTrack.length; i++) {
            let e = mediaTrack[i];
            let showing = self.props.time >= e.start_time &&
                          self.props.time <= e.end_time;
            self.players.push(
                <SecondaryPlayer
                    key={i}
                    data={e}
                    time={self.props.time}
                    hidden={!showing}
                    playing={self.props.playing}
                />);
        }
    }
    render() {
        if (this.props.data.length < 1) {
            return <div className="jux-media-display">
              <div className="help-text">
                  <h1>Place secondary elements</h1>
                  <p className="instructions">
                      Click the tracks below to place<br />
                      <span className="media-track-icon"></span>
                      media and
                      <span className="text-track-icon"></span>
                      text elements.
                      <br /><br />
                      {this.props.instructions}
                  </p>
              </div>
            </div>;
        }

        // TODO add image display area
        return <div className="jux-media-display">
                {this.players}
        </div>;
    }
}
