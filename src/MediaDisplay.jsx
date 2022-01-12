import React from 'react';
import PropTypes from 'prop-types';
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import {SVG} from '@svgdotjs/svg.js';
import AVPlayer from './AVPlayer.jsx';
import ImagePlayer from './ImagePlayer.jsx';
import {decodeQuotes} from './utils.js';
import {drawAnnotation} from './pdfUtils.js';

/**
 * Calculate the left margin pixel value, given these two args for a
 * pdf thumbnail:
 *
 * - el: the container DOM el
 * - pdfPageCanvas the pdf.js object that's centered inside the container.
 */
const calcPdfLeftMargin = function(el, pdfPageCanvas) {
    return (el.clientWidth / 2) - (pdfPageCanvas.width / 2);
};

export default class MediaDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.className = 'jux-media-video';
        this.players = [];
        this.mediaPlayerNodes = [];

        this.pdfViewer = null;
        this.pdfPageRef = React.createRef();

        this.onPDFPageRenderSuccess = this.onPDFPageRenderSuccess.bind(this);
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
                this.players.push(
                    <ImagePlayer
                        key={i}
                        url={e.source}
                        width={e.width}
                        height={e.height}
                        hidden={!showing}
                        annotationData={e.annotationData}
                    />);
            } else if (e.type === 'pdf') {
                const aData = JSON.parse(e.annotationData);
                let page = 1;
                if (aData && aData.geometry && aData.geometry.page) {
                    page = aData.geometry.page || 1;
                }

                this.players.push(
                    <div key={i} hidden={!showing}>
                        <Document file={e.source}>
                            <div
                                ref={this.pdfPageRef}
                                className="react-pdf-page-container">
                                <Page pageNumber={page}
                                      height={360}
                                      onRenderSuccess={
                                          (e) => this.onPDFPageRenderSuccess(
                                              e, aData)
                                      }
                                />
                            </div>
                        </Document>
                    </div>
                );
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
                  <h2>Place secondary elements</h2>
                  <p className="instructions">
                      Click the tracks below to place<br />
                      <span className="media-track-icon "></span>
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

    refreshPdfAnnotation(annotation=null) {
        if (!annotation && !this.state.selectedAnnotation) {
            return;
        }

        if (!this.pdfPageRef || !this.pdfPageRef.current) {
            return;
        }

        // The PDF's Page element is hidden at this moment - read the
        // width of the jux-media-display instead.
        const el = document.querySelector('.jux-media-display');
        this.pdfLeftMargin = Math.abs(calcPdfLeftMargin(el, this.pdfViewer));
        console.log('leftMargin', this.pdfLeftMargin);

        this.svgDraw.clear();

        drawAnnotation(
            this.svgDraw, annotation,
            this.pdfScale, -this.pdfLeftMargin, 0);
    }

    onPDFPageRenderSuccess(e, annotationData) {
        console.log('onPDFPageRenderSuccess', e, annotationData);
        this.pdfViewer = e;
        const el = this.pdfPageRef.current.querySelector('.react-pdf__Page');
        this.pdfScale = e.width / e.getViewport({scale: 1}).width;

        this.svgDraw = SVG().addTo(el);

        this.refreshPdfAnnotation(annotationData);
    }
}

MediaDisplay.propTypes = {
    data: PropTypes.array.isRequired,
    duration: PropTypes.number,
    instructions: PropTypes.string.isRequired,
    playing: PropTypes.bool.isRequired,
    time: PropTypes.number
};
