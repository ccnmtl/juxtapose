import _ from 'lodash';

const getYouTubeID = require('get-youtube-id');

export function collisionPresent(track, start_time, end_time) {
    if (track.length === 0 || (!start_time && !end_time)) {
        return false;
    }
    for (let e of track) {
        if (start_time <= e.end_time && end_time >= e.start_time) {
            return true;
        }
    }
    return false;
}

/**
 * {{ellipsis}}
 * Truncate the input string and removes all HTML tags
 *
 * @param  {String} str      The input string.
 * @param  {Number} limit    The number of characters to limit the string.
 * @param  {String} append   The string to append if charaters are omitted.
 * @return {String}          The truncated string.
 */
export function ellipsis(str, limit, append) {
    if (typeof str === 'undefined') {
        return '';
    }

    if (typeof append === 'undefined') {
        append = '…';
    }

    let sanitized = str.replace(/(<([^>]+)>)/g, '');
    if (sanitized.length > limit) {
        return sanitized.substr(0, limit - append.length) + append;
    } else {
        return sanitized;
    }
};

export function extractAssetData(s) {
    let id = null;
    let annotationId = null;
    if (s) {
        const matches = s.match(/\/asset\/(\d+)(\/annotations\/(\d+))?\/$/i);
        if (matches[1]) {
            id = parseInt(matches[1], 10);
        }
        if (matches[3]) {
            annotationId = parseInt(matches[3], 10);
        }
    }
    return {
        'id': id,
        'annotationId': annotationId
    };
}

/**
 * extractVideoData
 *
 * Given a video source object in Mediathread's asset api format,
 * return a juxtapose media object.
 */
export function extractVideoData(o) {
    if (o.youtube && o.youtube.url) {
        return {
            url: getYouTubeID(o.youtube.url),
            host: 'youtube'
        };
    }
    if (o.video && o.video.url) {
        return {
            url: o.video.url
        };
    }
    if (o.mp4_pseudo && o.mp4_pseudo.url) {
        return {
            url: o.mp4_pseudo.url
        };
    }
    return null;
}

/**
 * Given a number of seconds as a float, return an array
 * containing [minutes, seconds, centiseconds].
 */
export function getSeparatedTimeUnits(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - minutes * 60);
    const centiseconds = Math.round(
        (totalSeconds - (minutes * 60) - seconds) * 100);
    return [minutes, seconds, centiseconds];
}

export function getMinutes(totalSeconds) {
    return Math.floor(totalSeconds / 60);
}

export function getSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    return Math.floor(totalSeconds - minutes * 60);
}

export function getCentiseconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - minutes * 60);
    return Math.round((totalSeconds - (minutes * 60) - seconds) * 100);
}

export function formatTimecode(totalSeconds) {
    const units = getSeparatedTimeUnits(totalSeconds);
    return pad2(units[0]) + ':' + pad2(units[1]) + ':' + pad2(units[2]);
}

export function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

export function prepareMediaData(array) {
    let a = _.cloneDeep(array);
    for (let e of a) {
        // We only need the Mediathread ID here.
        e.media = e.id;
        delete e.host;
        delete e.source;
    }
    return a;
}

export function prepareTextData(array) {
    let a = _.cloneDeep(array);
    for (let e of a) {
        e.text = e.source;
        delete e.source;
    }
    return a;
}

/**
 * Given the JSON returned by the sequence API,
 * prepare this data to be used in React's state.
 */
export function loadMediaData(array) {
    let i = 0;
    for (let e of array) {
        // react-grid-layout requires a unique key for
        // each grid element.
        e.key = i;
        e.start_time = parseInt(e.start_time, 10);
        e.end_time = parseInt(e.end_time, 10);
        i++;
    }
    return array;
}

/**
 * Given the JSON returned by the sequence API,
 * prepare this data to be used in React's state.
 */
export function loadTextData(array) {
    let i = 0;
    for (let e of array) {
        e.type = 'txt';
        e.key = i;
        e.start_time = parseInt(e.start_time, 10);
        e.end_time = parseInt(e.end_time, 10);
        e.source = e.text;
        delete e.text;
        i++;
    }
    return array;
}
