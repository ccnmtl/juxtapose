/**
 * Media JSON format:
 *
 * {
 *   key: <number> - unique index
 *   startTime: <number>
 *   endTime: <number>
 *   type: vid|img
 *   host: youtube|vimeo (optional)
 *   source: <string> - identification data, i.e. URL or video ID.
 * }
 */
export const mediaTrackData = [
    {
        key: 0,
        startTime: 1,
        endTime: 15,
        type: 'vid',
        source: 'videos/wildspot.mp4'
    },
    {
        key: 1,
        startTime: 15,
        endTime: 30,
        type: 'vid',
        host: 'vimeo',
        source: '35694950'
    },
    {
        key: 2,
        startTime: 32,
        endTime: 37.5,
        type: 'vid',
        host: 'youtube',
        source: 'suUJxQoIA9k'
    },
    {
        key: 3,
        startTime: 38,
        endTime: 55,
        type: 'img',
        source: 'img/image.jpg'
    }
];

export const textTrackData = [
    {
        key: 0,
        startTime: 5,
        endTime: 40,
        type: 'txt',
        source: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        key: 1,
        startTime: 45,
        endTime: 55,
        type: 'txt',
        source: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
];

export const collectionData = [
    {
        title: 'Item A',
        thumbnail: 'img/image.jpg'
    },
    {
        title: 'Item B',
        thumbnail: 'img/image.jpg'
    },
    {
        title: 'Item C',
        thumbnail: 'img/image.jpg'
    },
    {
        title: 'Item D',
        thumbnail: 'img/image.jpg'
    }
];
