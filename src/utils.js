import _ from 'lodash';

const getYouTubeID = require('get-youtube-id');

/**
 * Returns true if the given elements collide. Only looks at
 * their start_time and end_time.
 */
export function elementsCollide(e1, e2) {
    return (e1.start_time <= e2.end_time) && (e1.end_time >= e2.start_time);
}

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
        let e1 = {
            start_time: start_time,
            end_time: end_time
        };
        if (elementsCollide(e1, e)) {
            return true;
        }
    }

    return false;
}

/**
 * This function is used when adding new elements.
 *
 * @param {Number} requestedStartTime
 *     A requested start time for the new element.
 *
 * @param {Number} requestedEndTime
 *     A requested end time for the new element (we default to 30
 *     seconds after the new element's start time).
 *
 * @param {Number} sequenceDuration
 *     The sequence duration.
 *
 * @param {Array} track
 *     The existing data for this track.
 *
 * @return {Number}
 *     The new end time, constrained based on the track data and
 *     sequence duration.
 */
export function constrainEndTimeToAvailableSpace(
    requestedStartTime, requestedEndTime, sequenceDuration, track, idx
) {
    if (requestedEndTime <= requestedStartTime) {
        throw new Error('end time must be greater than start time.');
    }

    if (!sequenceDuration) {
        throw new Error('A sequence must have a duration.');
    }

    const requestedEl = {
        start_time: requestedStartTime,
        end_time: requestedEndTime
    };
    for (let i=0; i < track.length; i++) {
        // ignore the element at idx
        if (i === idx) {
            continue;
        }

        if (elementsCollide(requestedEl, track[i])) {
            return track[i].start_time;
        }
    }

    if (requestedEndTime > sequenceDuration) {
        return sequenceDuration;
    }

    return requestedEndTime;
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
                    duration: duration,
                    range1: annotation.range1,
                    annotationData: annotation.annotation_data
                };
            }
        }
    }
    return {duration: undefined, range1: 0};
}

/**
 * getVimeoId
 *
 * Parse the Vimeo ID out of the vimeo URL
 */
export function getVimeoID(url) {
    let regExp = /^.*vimeo\.com\/([0-9]+)/;
    return regExp.exec(url)[1];
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
    if (o.vimeo && o.vimeo.url) {
        return {
            url: o.vimeo.url,
            host: 'vimeo'
        }
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

export function hasOutOfBoundsElement(duration, mediaTrack, textTrack) {
    for (let i = 0; i < mediaTrack.length; i++) {
        const el = mediaTrack[i];
        if (el.end_time > duration) {
            return true;
        }
    }
    for (let i = 0; i < textTrack.length; i++) {
        const el = textTrack[i];
        if (el.end_time > duration) {
            return true;
        }
    }
    return false;
}

export function removeOutOfBoundsElements(duration, track) {
    if (!duration) {
        // Can't remove anything if there's no duration.
        return track;
    }
    let newTrack = [];
    for (let i = 0; i < track.length; i++) {
        const el = track[i];
        if (el.end_time <= duration) {
            newTrack.push(el);
        }
    }
    return newTrack;
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
    const duration = type === 'img' ? 30 : annotation.duration;

    return {
        url: source.url,
        host: source.host,
        type: type,
        startTime: annotation.range1,
        duration: duration,
        data: annotation.annotationData,
        width: source.width,
        height: source.height
    };
}

/**
 * Given a number of seconds as a float, return an array
 * containing [minutes, seconds, centiseconds].
 */
export function getSeparatedTimeUnits(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - minutes * 60);

    // Really this should be Math.round() instead of Math.floor(),
    // but using Math.round() allows the centiseconds to be
    // 100 if totalSeconds is something like 1.999602. That creates
    // some code complexity, so I'm compromising by introducing
    // this small imprecision.
    const centiseconds = Math.floor(
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

export function parseTimecode(str) {
    const parts = str.split(':');
    return (Number(parts[0]) * 60) +
        Number(parts[1]) +
        (Number(parts[2]) / 100);
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
        e.media = e.media;
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

/**
 * Derive the currently playing element given the current time
 * and the track state.
 */
export function getElement(data, currentTime) {
    for (let e of data) {
        if (currentTime >= e.start_time && currentTime <= e.end_time) {
            return e;
        }
    }
    return null;
}

export function reassignKeys(track) {
    for (let i = 0; i < track.length; i++) {
        track[i].key = i;
    }
}

/**
 * This function handles the drag stop event for track items.
 *
 * It takes a track array, the dragged grid item, and the sequence
 * duration.
 *
 * It returns the new state of the track, which the caller can save
 * with setState. If there are no necessary changes to the track,
 * this function returns null.
 */
export function trackItemDragHandler(origTrack, item, sequenceDuration) {
    // react-grid-layout sets a 'moved' flag on the dragged item.
    if (item.moved === false) {
        return null;
    }

    const origElem = _.find(origTrack, ['key', parseInt(item['i'], 10)]);
    let newTrack = origTrack.slice();
    const elem = _.find(newTrack, ['key', parseInt(item['i'], 10)]);
    const percent = item.x / 1000;
    const startTime = percent * sequenceDuration;

    // Check that the value actually needs to be updated.
    if (startTime === origElem.start_time ||
        // Allow just over a hundredth of a second margin of
        // error. This can occur when clicking the track elements.
        Math.abs(startTime - origElem.start_time) <= 0.015
       ) {
        return null;
    }

    const len = elem.end_time - elem.start_time;
    elem.start_time = startTime;
    elem.end_time = elem.start_time + len;

    newTrack = _.reject(newTrack, ['key', elem.key]);
    newTrack.push(elem);
    newTrack = _.sortBy(newTrack, 'key');
    return newTrack;
}
