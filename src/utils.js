export function formatDuration(seconds) {
    const minutes = pad2(Math.floor(seconds / 60));
    const newSeconds = pad2(Math.round(seconds - minutes * 60));
    return minutes + ':' + newSeconds;
}

export function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}
