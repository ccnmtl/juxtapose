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

export function formatTimecode(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - minutes * 60);
    const microseconds = Math.round(
        (totalSeconds - (minutes * 60) - seconds) * 100);
    return pad2(minutes) + ':' + pad2(seconds) + ':' + pad2(microseconds);
}

export function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}
