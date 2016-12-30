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
    objectProportioned() {
        var dim = {w: 180, h: 90};
        var w = this.props.width || 180;
        var h = this.props.height || 90;
        if (w / 2 > h) {
            dim.h = Math.ceil(180 * h / w);
        } else {
            dim.w = Math.ceil(90 * w / h);
        }
        return dim;
    }
    zoomToExtent(extent) {
        this.map.getView().fit(extent, this.map.getSize());
    }
    center(x, y) {
        this.map.getView().setCenter([x, y]);
    }
    zoom(level) {
        this.map.getView().setZoom(level);
    }
    initializeMap() {
        if (this.map) {
            return;
        }
        
        let attrs = JSON.parse(this.props.annotationData);
        let dim = this.objectProportioned();
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
                projection: projection
            })
        });

        if (attrs.x !== undefined) {
            this.center(attrs.x, attrs.y);
            this.zoom(attrs.zoom - 1);
        } else {
            this.zoomToExtent(extent);
        }
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
