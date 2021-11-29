import React from 'react';
import PropTypes from 'prop-types';
import VidItemThumb from './VidItemThumb.jsx';
import {ellipsis} from './utils.js';
import {getVimeoID} from './utils.js';

export default class TrackElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vimeoThumbnailUrl: null
        };
    }
    vimeoThumbnailListener(e) {
        const json = e.target.responseText;

        let data = null;
        try {
            data = JSON.parse(json);
        } catch(error) {
            console.error('Can\'t parse vimeo thumbnail JSON', error);
            return;
        }

        if (!data) {
            console.error('Can\'t parse vimeo thumbnail JSON');
            return;
        }

        const url = data[0].thumbnail_medium;
        this.setState({vimeoThumbnailUrl: url});
    }
    getVimeoThumbnailUrl(data) {
        const vimeoID = getVimeoID(data.source);
        const url = 'https://vimeo.com/api/v2/video/' + vimeoID +
                    '.json';
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', this.vimeoThumbnailListener.bind(this));
        xhr.open('GET', url, true);
        xhr.send(null);
    }
    renderVidThumb(data) {
        if (data.host === 'youtube') {
            const thumbUrl = 'https://img.youtube.com/vi/' + data.source +
                             '/default.jpg';
            return <VidItemThumb url={thumbUrl} />;
        } else if (data.host === 'vimeo') {
            if (!this.state.vimeoThumbnailUrl) {
                this.getVimeoThumbnailUrl(data);
            }
            if (!this.state.vimeoThumbnailUrl) {
                return '';
            }
            return <VidItemThumb url={this.state.vimeoThumbnailUrl} />;
        }
        return <video className="jux-media-item-middle">
            <source src={data.source} type="video/mp4" />
        </video>;
    }
    renderImgThumb(data) {
        const style = {
            'backgroundImage': 'url(' + data.source + ')',
            'backgroundSize': 'contain',
            'backgroundPosition': 'center',
            'backgroundRepeat': 'no-repeat'
        };
        return <div className="jux-media-item-middle" style={style}></div>;
    }
    renderTxtThumb(data) {
        let maxLen = 10;
        if (this.el && this.el.clientWidth) {
            maxLen = Math.round(this.el.clientWidth / 15);
        }
        return <p className="jux-media-item-middle">
            {ellipsis(data.source, maxLen)}
        </p>;
    }
    componentDidMount() {
        // Text elements rely on their own DOM node's clientWidth in
        // order to render accurately (see renderTxtThumb), so force
        // them to be re-rendered when the DOM node is available.
        if (this.props.data.type === 'txt') {
            this.forceUpdate();
        }
    }
    render() {
        let c = '';
        if (this.props.data.type === 'vid') {
            c = this.renderVidThumb(this.props.data);
        } else if (this.props.data.type === 'img') {
            c = this.renderImgThumb(this.props.data);
        } else if (this.props.data.type === 'txt') {
            c = this.renderTxtThumb(this.props.data);
        }
        let cls = this.props.className;
        if (this.props.isActive) {
            cls += ' jux-item-active';
        }
        return <div data={this.props.data}
                    ref={(el) => this.el = el}
                    data-dragging={this.props.dragging}
                    className={cls}
                    style={this.props.style}
                    onClick={this.onEditButtonClick.bind(this)}
                    onMouseDown={this.props.onMouseDown}
                    onTouchEnd={this.props.onTouchEnd}
                    onTouchStart={this.props.onTouchStart}>
            {c}
        </div>;
    }
    onEditButtonClick(e) {
        this.props.onEditButtonClick(e, this);
    }
}

TrackElement.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object.isRequired,
    dragging: PropTypes.bool,
    isActive: PropTypes.bool.isRequired,
    style: PropTypes.object,
    onEditButtonClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchStart: PropTypes.func
};
