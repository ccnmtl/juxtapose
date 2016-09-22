export function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - minutes * 60);
    const microseconds = Math.round(
        (totalSeconds - (minutes * 60) - seconds) * 100);
    return pad2(minutes) + ':' + pad2(seconds) + ':' + pad2(microseconds);
}

export function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}
