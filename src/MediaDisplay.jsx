import React from 'react';
import PropTypes from 'prop-types';
import AVPlayer from './AVPlayer.jsx';
import ImagePlayer from './ImagePlayer.jsx';
import {decodeQuotes} from './utils.js';


export default class MediaDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.className = 'jux-media-video';
        this.players = [];
        this.mediaPlayerNodes = [];
    }
    componentDidUpdate(prevProps) {
        this.generatePlayers(prevProps.data);
    }
    /**
     * Returns true if the element should be shown based on the
     * current timeframe.
     */
    isElementShowing(e) {
       return this.props.time >= e.start_time &&
              this.props.time <= e.end_time;
    }
    generatePlayers(mediaTrack) {
        this.players = [];
        this.mediaPlayerNodes = [];
        for (let i = 0; i < mediaTrack.length; i++) {
            let e = mediaTrack[i];
            let showing = this.isElementShowing(e);
            if (e.type === 'img') {
                this.players.push(<ImagePlayer
                           key={i}
                           url={e.source}
                           width={e.width}
                           height={e.height}
                           hidden={!showing}
                           annotationData={e.annotationData}
                       />);
            } else {
                this.players.push(
                    <AVPlayer
                        ref={(c) => this.mediaPlayerNodes.push(c)}
                        key={i}
                        data={e}
                        sequenceDuration={this.props.duration}
                        time={this.props.time}
                        hidden={!showing}
                        playing={this.props.playing}
                    />);
            }
        }
    }
    render() {
        if (this.props.data.length < 1) {
            const instructions = decodeQuotes(this.props.instructions);
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
                      {instructions}
                  </p>
              </div>
            </div>;
        }

        return <div className="jux-media-display">
                {this.players}
               </div>;
    }
    seekTo(percentage) {
        this.mediaPlayerNodes.forEach(function(player) {
            if (player && player.seekTo) {
                player.seekTo(percentage);
            }
        });
    }
}

MediaDisplay.propTypes = {
    data: PropTypes.array.isRequired,
    duration: PropTypes.number,
    instructions: PropTypes.string.isRequired,
    playing: PropTypes.bool.isRequired,
    time: PropTypes.number
};
