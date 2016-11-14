import Cookies from 'js-cookie';

export default class Xhr {
    createSequenceAsset(spineVidId, courseId, projectId) {
        const csrftoken = Cookies.get('csrftoken');
        fetch('/sequence/api/assets/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                spine: spineVidId,
                course: courseId,
                project: projectId
            })
        });
    }
    updateSequenceAsset() {
    }
}
