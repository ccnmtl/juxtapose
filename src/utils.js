export function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

export function formatDuration(seconds) {
    var minutes = pad2(Math.floor(seconds / 60));
    var seconds = pad2(Math.round(seconds - minutes * 60));
    return minutes + ':' + seconds;
}
