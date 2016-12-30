import React from 'react';
const ol = require('openlayers');

// http://stackoverflow.com/questions/35454014/clicks-on-reactjs-components-not-firing-on-an-openlayers-overlay
// https://github.com/openlayers/ol3/issues/6087

export default class ImagePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.mapId = 'image-player-' + Math.random().toString(16).slice(2);
    }
    object_proportioned() {
        var dim = {w: 480, h: 360};
        var w = this.props.width || 480;
        var h = this.props.height || 360;
        if (w / 2 > h) {
            dim.h = Math.ceil(480 * h / w);
        } else {
            dim.w = Math.ceil(360 * w / h);
        }
        return dim;
    }
    initializeMap() {
        if (this.map) {
            return;
        }
        
        let attrs = JSON.parse(this.props.annotationData);
        let dim = this.object_proportioned();
        let extent = [-dim.w, -dim.h, dim.w, dim.h];

        var projection = new ol.proj.Projection({
            units: 'pixels',
            extent: extent
        });

        this.map = new ol.Map({
            interactions: ol.interaction.defaults({mouseWheelZoom:false}),
            controls: [],
            layers: [
                new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        url: this.props.url,
                        projection: projection,
                        imageExtent: extent
                    })
                })
            ],
            target: this.mapId,
            view: new ol.View({
                projection: projection,
                center: ol.extent.getCenter(extent),
                zoom: attrs.zoom - 1
            })
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        let shouldUpdate = this.props.annotationData !== nextProps.annotationData ||
                           this.props.url !== nextProps.url ||
                           this.props.hidden !== nextProps.hidden;
        if (this.map && (
            this.props.annotationData !== nextProps.annotationData ||
            this.props.url !== nextProps.url)) {
            delete this.map;
        }
        return shouldUpdate;
    }
    render() {
        let displayImagePlayer = this.props.hidden ? 'none' : 'block';
        return <div id={this.mapId} className='image-player'
                    style={{'display': displayImagePlayer}}>
               </div>;
    }
    componentDidUpdate() {
        this.initializeMap();
    }
}
