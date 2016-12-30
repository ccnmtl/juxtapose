import React from 'react';
const ol = require('openlayers');
require('openlayers/css/ol.css');

// http://stackoverflow.com/questions/35454014/clicks-on-reactjs-components-not-firing-on-an-openlayers-overlay
// https://github.com/openlayers/ol3/issues/6087

export default class ImagePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
    }
    object_proportioned() {
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
    componentDidMount() {
        let attrs = JSON.parse(this.props.annotationData);
        console.log(attrs);

        let dim = this.object_proportioned();
        let extent = [-dim.w, -dim.h, dim.w, dim.h];

        var projection = new ol.proj.Projection({
            code: 'Flatland:1',
            units: 'pixels',
            extent: extent
        });

        var map = new ol.Map({
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
            target: 'image-player',
            view: new ol.View({
                projection: projection,
                center: ol.extent.getCenter(extent),
                zoom: attrs.zoom - 1
            })
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        // if the annotationData has changed, then
        // probably re-render
        return false; // render only once
    }
    render() {
        return <div id="image-player"></div>;
    }
}
