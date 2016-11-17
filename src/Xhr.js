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
    createOrUpdateSequenceAsset(spineVidId, courseId, projectId) {
        const self = this;
        fetch('/project/api/projectsequenceassets/?project=' + projectId,
              this.xhrOpts)
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
        this.xhrOpts.method = 'post';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId
        });
        fetch('/sequence/api/assets/', this.xhrOpts);
    }
    updateSequenceAsset(sequenceAssetId, spineVidId, courseId, projectId) {
        this.xhrOpts.method = 'put';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId
        });
        const url = '/sequence/api/assets/' + sequenceAssetId + '/';
        fetch(url, this.xhrOpts);
    }
}
