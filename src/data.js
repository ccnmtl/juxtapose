/**
 * Media JSON format:
 *
 * {
 *   key: <number> - unique index
 *   start_time: <number>
 *   end_time: <number>
 *   type: vid|img|txt
 *   host: youtube|vimeo (optional)
 *   source: <string> - identification data, i.e. URL or video ID.
 *   id: The Mediathread Asset ID.
 * }
 */
export const mediaTrackData = [
    {
        key: 0,
        start_time: 1,
        end_time: 15,
        type: 'vid',
        source: 'static/videos/wildspot.mp4',
        id: 1
    },
    {
        key: 1,
        start_time: 15,
        end_time: 30,
        type: 'vid',
        host: 'vimeo',
        source: '35694950',
        id: 2
    },
    {
        key: 2,
        start_time: 32,
        end_time: 37.5,
        type: 'vid',
        host: 'youtube',
        source: 'suUJxQoIA9k',
        id: 3
    },
    {
        key: 3,
        start_time: 38,
        end_time: 55,
        type: 'img',
        source: 'static/img/image.jpg',
        id: 4
    }
];

export const textTrackData = [
    {
        key: 0,
        start_time: 5,
        end_time: 40,
        type: 'txt',
        source: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'
    },
    {
        key: 1,
        start_time: 45,
        end_time: 55,
        type: 'txt',
        source: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non'
    }
];
