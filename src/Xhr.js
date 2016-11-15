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
    createSequenceAsset(spineVidId, courseId, projectId) {
        this.xhrOpts.method = 'post';
        this.xhrOpts.body = JSON.stringify({
            spine: spineVidId,
            course: courseId,
            project: projectId
        });
        fetch('/sequence/api/assets/', this.xhrOpts);
    }
    updateSequenceAsset() {
    }
}
