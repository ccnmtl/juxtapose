import _ from 'lodash';

const getYouTubeID = require('get-youtube-id');

/**
 * Returns true if there's a collision present given the
 * following input:
 *
 * track - an array of track elements
 * duration - the total duration for the sequence asset
 * start_time - A possible start time for the element in question
 * end_time - A possible end time for the element in question
 *
 * All times are specified in seconds.
 */
export function collisionPresent(track, duration, start_time, end_time) {
    if (end_time <= start_time) {
        throw new Error('end_time must be greater than start_time.');
    }

    if (!duration) {
        throw new Error('A sequence must have a duration.');
    }

    if (end_time > duration) {
        return true;
    }

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

/**
 * extractAnnotation
 *
 * Given a source object in Mediathread's asset api format,
 * return a annotation properties
 */
export function extractAnnotation(assetCtx, annotationId) {
    for (var i = 0; i < assetCtx.annotations.length && annotationId; i++) {
        let annotation = assetCtx.annotations[i];
        if (annotation.id === annotationId) {
            if (!annotation.is_global_annotation) {
                let duration = (annotation.range2 - annotation.range1) || 30;
                return {
                    duration: Math.min(30, duration),
                    range1: annotation.range1,
                    annotationData: annotation.annotation_data
                };
            }
        }
    }
    return {duration: undefined, range1: 0};
}

/**
 * extractSource
 *
 * Given a source object in Mediathread's asset api format,
 * return a juxtapose media object.
 */
export function extractSource(o) {
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
    if (o.mp4_audio && o.mp4_audio.url) {
        return {
            url: o.mp4_audio.url
        };
    }
    if (o.image && o.image.url) {
        return {
            url: o.image.url,
            width: o.image.width,
            height: o.image.height
        };
    }
    return null;
}

/**
 * parseAsset
 * 
 */
export function parseAsset(json, assetId, annotationId) {
    const assetCtx = json.assets[assetId];
    const source = extractSource(assetCtx.sources);
    const annotation = extractAnnotation(assetCtx, annotationId);
    const type = assetCtx.primary_type === 'image' ? 'img' : 'vid';
    return {
        url: source.url,
        host: source.host,
        type: type,
        startTime: annotation.range1,
        duration: annotation.duration,
        data: annotation.annotationData
    };
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
        e.media = e.annotationId || e.media;
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
