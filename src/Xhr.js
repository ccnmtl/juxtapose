import Cookies from 'js-cookie';

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
    createOrUpdateSequenceAsset(spineVidId, courseId, projectId) {
        if (!spineVidId || !courseId || !projectId) {
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
                        projectId);
                } else {
                    self.createSequenceAsset(spineVidId, courseId, projectId);
                }
            });
    }
    createSequenceAsset(spineVidId, courseId, projectId) {
        if (!spineVidId || !courseId || !projectId) {
            throw 'createSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'post';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId
        });
        fetch(this.sequenceAssetsUrl(), this.xhrOpts);
    }
    updateSequenceAsset(sequenceAssetId, spineVidId, courseId, projectId) {
        if (!sequenceAssetId || !spineVidId || !courseId || !projectId) {
            throw 'updateSequenceAsset: missing parameter';
        }

        this.xhrOpts.method = 'put';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId
        });
        fetch(this.sequenceAssetUrl(sequenceAssetId), this.xhrOpts);
    }
}
