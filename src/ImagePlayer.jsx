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
    hasFeature(attrs) {
        return attrs.hasOwnProperty('feature') ||
               attrs.hasOwnProperty('geometry') ||
               attrs.hasOwnProperty('xywh');
    }
    addVectorLayer(props, projection, attrs) {
        var formatter = new ol.format.GeoJSON({
            dataProjection: projection,
            featureProjection: projection});

        var feature = formatter.readFeature(attrs);
        var layer = new ol.layer.Vector({
            title: 'annotation',
            source: new ol.source.Vector({
                features: [feature]
            })//,
            //style: styleFunction
        });

        this.map.addLayer(layer);
    }
    addImageLayer(props, projection, extent) {
        var layer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: this.props.url,
                projection: projection,
                imageExtent: extent
            })
        });
        this.map.addLayer(layer);
    }
    initializeMap() {
        if (this.map) {
            return;
        }

        let attrs = JSON.parse(this.props.annotationData);
        attrs.type = 'Feature';
        
        let dim = this.objectProportioned();
        let extent = [-dim.w, -dim.h, dim.w, dim.h];
        
        var projection = new ol.proj.Projection({
            units: 'pixels',
            extent: extent
        });

        this.map = new ol.Map({
            interactions: ol.interaction.defaults({mouseWheelZoom:false}),
            controls: [],
            target: this.mapId,
            view: new ol.View({
                projection: projection
            })
        });

        this.addImageLayer(this.props, projection, extent);

        if (this.hasFeature(attrs)) {
            this.addVectorLayer(this.props, projection, attrs);
            this.center(attrs.x, attrs.y);
            this.zoom(attrs.zoom - 1.4);
        } else if (attrs.x !== undefined) {
            this.center(attrs.x, attrs.y);
            this.zoom(attrs.zoom - 1.2);
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
