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
    componentDidMount() {
        var extent = [0, 0, 480, 360];
        var projection = new ol.proj.Projection({
            units: 'pixels',
            extent: extent
        });

        var map = new ol.Map({
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
                zoom: 2
            })
        });
    }
    componentWillUnmount() {
        console.log('component unmount');
    }
    shouldComponentUpdate(nextProps, nextState){
        return false; // render only once
    }
    render() {
        return <div id="image-player"></div>;
    }
}
