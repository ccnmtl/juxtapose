import React from 'react';
import PropTypes from 'prop-types';
import GeoJSON from 'ol/format/geojson';
import {default as olExtent} from 'ol/extent';
import Image from 'ol/layer/image';
import ImageStatic from 'ol/source/imagestatic';
import interaction from 'ol/interaction';
import Map from 'ol/map';
import Projection from 'ol/proj/projection';

import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';

import {default as VectorLayer} from 'ol/layer/vector';
import {default as VectorSource} from 'ol/source/vector';
import View from 'ol/view';

export default class ImagePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.mapId = 'image-player-' + Math.random().toString(16).slice(2);
    }
    styleFunction(feature) {
        if (!this.styles) {
            this.styles = {
                'Polygon': [
                    new Style({
                        stroke: new Stroke({
                            color: '#ffffff',
                            width: 4
                        }),
                        fill: new Fill({
                            color: 'rgba(255,255,255,0)'
                        })
                    }),
                    new Style({
                        stroke: new Stroke({
                            color: '#905050', width: 2
                        })
                    })
                ],
                'Point': [
                    new Style({
                        image: new Circle({
                            radius: 6,
                            fill: null,
                            stroke: new Stroke({
                                color: '#ffffff', width: 4})
                        })
                    }),
                    new Style({
                        image: new Circle({
                            radius: 6,
                            fill: null,
                            stroke: new Stroke({
                                color: '#905050', width: 2})
                        })
                    })
                ]
            };
        }
        const gtype = feature.getGeometry().getType();
        return this.styles[gtype];
    }
    objectProportioned() {
        let dim = {w: 180, h: 90};
        const w = this.props.width || 180;
        const h = this.props.height || 90;
        if (w / 2 > h) {
            dim.h = Math.ceil(180 * h / w);
        } else {
            dim.w = Math.ceil(90 * w / h);
        }
        return [-dim.w, -dim.h, dim.w, dim.h];
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
        return Object.prototype.hasOwnProperty.call(attrs, 'feature') ||
               Object.prototype.hasOwnProperty.call(attrs, 'geometry') ||
               Object.prototype.hasOwnProperty.call(attrs, 'xywh');
    }
    addVectorLayer(props, projection, attrs) {
        const formatter = new GeoJSON({
            dataProjection: projection,
            featureProjection: projection
        });

        const feature = formatter.readFeature(attrs);
        const layer = new VectorLayer({
            title: 'annotation',
            source: new VectorSource({
                features: [feature]
            }),
            style: this.styleFunction(feature)
        });

        this.map.addLayer(layer);

        const extent = feature.getGeometry().getExtent();
        if (attrs.zoom) {
            const coord = olExtent.getCenter(extent);
            this.center(coord[0], coord[1]);
            this.zoom(attrs.zoom);
        } else {
            this.zoomToExtent(projection.getExtent());
        }
    }
    addImageLayer(props, projection, extent) {
        const layer = new Image({
            source: new ImageStatic({
                url: this.props.url,
                projection: projection,
                imageExtent: extent
            })
        });
        this.map.addLayer(layer);
    }
    initializeMap() {
        const extent = this.objectProportioned();

        const projection = new Projection({
            units: 'pixels',
            extent: extent
        });

        this.map = new Map({
            interactions: interaction.defaults({mouseWheelZoom:false}),
            controls: [],
            target: this.mapId,
            view: new View({
                projection: projection
            })
        });

        this.addImageLayer(this.props, projection, extent);

        let attrs = null;
        if (this.props.annotationData) {
            // If there's annotation data, parse it and display it as a
            // vector layer in OpenLayers.
            try {
                attrs = JSON.parse(this.props.annotationData);
            } catch(error) {
                console.error('Can\'t parse image annotation JSON', error);
                return;
            }

            if (!attrs) {
                console.error('Can\'t parse image annotation JSON');
                return;
            }

            attrs.type = 'Feature'; // required for ol2 > ol3 migration
        }

        if (attrs && this.hasFeature(attrs)) {
            this.addVectorLayer(this.props, projection, attrs);
        } else if (attrs && attrs.x !== undefined) {
            this.center(attrs.x, attrs.y);
            this.zoom(attrs.zoom - .5);
        } else {
            this.zoomToExtent(extent);
        }
    }
    shouldComponentUpdate(nextProps) {
        return (this.map === undefined && !nextProps.hidden) ||
               this.props.annotationData !== nextProps.annotationData ||
               this.props.hidden !== nextProps.hidden;
    }
    render() {
        const display = this.props.hidden ? 'none' : 'block';
        return <div id={this.mapId} className='image-player'
                    style={{'display': display}}>
               </div>;
    }
    componentDidUpdate() {
        if (this.map) {
            this.map.setTarget(null);
            delete this.map;
        }

        if (!this.props.hidden) {
            this.initializeMap();
        }
    }
}

ImagePlayer.propTypes = {
    annotationData: PropTypes.string,
    height: PropTypes.number,
    hidden: PropTypes.bool.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number
};
