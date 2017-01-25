import Cookies from 'js-cookie';
import isFinite from 'lodash/isFinite';
import {prepareMediaData, prepareTextData} from './utils.js';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

export default class Xhr {
    constructor() {
        const csrftoken = Cookies.get('csrftoken');
        this.xhrOpts = {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            credentials: 'same-origin'
        };
    }

    // API Endpoints
    assetUrl(assetId) {
        return '/api/asset/' + assetId + '/';
    }
    projectSequenceAssetUrl(projectId) {
        return '/project/api/projectsequenceassets/?project=' + projectId;
    }
    sequenceAssetUrl(sequenceAssetId) {
        return '/sequence/api/assets/' + sequenceAssetId + '/';
    }
    sequenceAssetsUrl() {
        return '/sequence/api/assets/';
    }

    getAsset(assetId) {
        if (!assetId) {
            throw 'getAsset: assetId is required.';
        }

        return fetch(this.assetUrl(assetId), this.xhrOpts)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                return json;
            });
    }
    getSequenceAsset(projectId) {
        if (!projectId) {
            throw 'getSequenceAsset: projectId is required.';
        }

        return fetch(this.projectSequenceAssetUrl(projectId), this.xhrOpts)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                if (json.length > 0) {
                    return json[0].sequence_asset;
                }
                return null;
            });
    }
    createOrUpdateSequenceAsset(annotationId, spineVolume, courseId, projectId,
                                mediaTrack, textTrack) {
        if (!annotationId || !isFinite(spineVolume) || !courseId ||
            !projectId || !mediaTrack || !textTrack
           ) {
            throw 'createOrUpdateSequenceAsset: missing parameter';
        }

        const self = this;
        return fetch(this.projectSequenceAssetUrl(projectId), this.xhrOpts)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                if (json.length > 0) {
                    const sequenceAssetId = json[0].sequence_asset.id;
                    return self.updateSequenceAsset(
                        sequenceAssetId,
                        annotationId,
                        spineVolume,
                        courseId,
                        projectId,
                        mediaTrack,
                        textTrack);
                } else {
                    return self.createSequenceAsset(
                        annotationId,
                        spineVolume,
                        courseId,
                        projectId,
                        mediaTrack,
                        textTrack);
                }
            });
    }
    createSequenceAsset(annotationId, spineVolume, courseId, projectId,
                        mediaTrack, textTrack) {
        if (!annotationId || !isFinite(spineVolume) || !courseId ||
            !projectId || !mediaTrack || !textTrack
           ) {
            throw 'createSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'post';
        this.xhrOpts.body = JSON.stringify({
            spine: annotationId,
            spine_volume: spineVolume,
            course: courseId,
            project: projectId,
            media_elements: prepareMediaData(mediaTrack),
            text_elements: prepareTextData(textTrack)
        });
        return fetch(this.sequenceAssetsUrl(), this.xhrOpts);
    }
    updateSequenceAsset(sequenceAssetId, annotationId, spineVolume, courseId,
                        projectId, mediaTrack, textTrack) {
        if (!sequenceAssetId || !annotationId || !isFinite(spineVolume) ||
            !courseId || !projectId || !mediaTrack || !textTrack
           ) {
            throw 'updateSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'put';
        this.xhrOpts.body = JSON.stringify({
            id: sequenceAssetId,
            spine: annotationId,
            spine_volume: spineVolume,
            course: courseId,
            project: projectId,
            media_elements: prepareMediaData(mediaTrack),
            text_elements: prepareTextData(textTrack)
        });
        return fetch(
            this.sequenceAssetUrl(sequenceAssetId),
            this.xhrOpts)
            .then(checkStatus)
            .then(parseJSON);
    }
}
