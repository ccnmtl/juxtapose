import Cookies from 'js-cookie';
import {prepareMediaData, prepareTextData} from './utils.js';

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
            credentials: 'same-origin',
            body: {}
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
    createOrUpdateSequenceAsset(spineVidId, courseId, projectId,
                                mediaTrack, textTrack) {
        if (!spineVidId || !courseId || !projectId ||
            !mediaTrack || !textTrack
           ) {
            throw 'createOrUpdateSequenceAsset: missing parameter';
        }

        const self = this;
        fetch(this.projectSequenceAssetUrl(projectId), this.xhrOpts)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                if (json.length > 0) {
                    const sequenceAssetId = json[0].sequence_asset.id;
                    self.updateSequenceAsset(
                        sequenceAssetId,
                        spineVidId,
                        courseId,
                        projectId,
                        mediaTrack,
                        textTrack);
                } else {
                    self.createSequenceAsset(
                        spineVidId,
                        courseId,
                        projectId,
                        mediaTrack,
                        textTrack);
                }
            });
    }
    createSequenceAsset(spineVidId, courseId, projectId,
                        mediaTrack, textTrack) {
        if (!spineVidId || !courseId || !projectId ||
            !mediaTrack || !textTrack
           ) {
            throw 'createSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'post';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId,
            media_elements: prepareMediaData(mediaTrack),
            text_elements: prepareTextData(textTrack)
        });
        fetch(this.sequenceAssetsUrl(), this.xhrOpts);
    }
    updateSequenceAsset(sequenceAssetId, spineVidId, courseId, projectId,
                        mediaTrack, textTrack) {
        if (!sequenceAssetId || !spineVidId || !courseId || !projectId ||
            !mediaTrack || !textTrack
           ) {
            throw 'updateSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'put';
        this.xhrOpts.body = JSON.stringify({
            id: sequenceAssetId,
            spine: spineVidId,
            course: courseId,
            project: projectId,
            media_elements: prepareMediaData(mediaTrack),
            text_elements: prepareTextData(textTrack)
        });
        fetch(this.sequenceAssetUrl(sequenceAssetId), this.xhrOpts);
    }
}
