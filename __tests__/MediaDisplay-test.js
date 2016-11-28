import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {getCurrentItem} from '../src/MediaDisplay.jsx';

describe('getCurrentItem', () => {
    it('handles empty data appropriately', () => {
        expect(getCurrentItem([], 3.2)).toBeNull;
        expect(getCurrentItem([], 0)).toBeNull;
        expect(getCurrentItem([], -1)).toBeNull;
    });
    it('returns an accurate current item', () => {
        let data = [{
                key: 0,
                start_time: 5,
                end_time: 60,
                type: 'vid',
                source: 'video.mp4'
        }];
        expect(getCurrentItem(data, 3.2)).toBeNull;
        expect(getCurrentItem(data, 55)).toEqual({
            key: 0,
            start_time: 5,
            end_time: 60,
            type: 'vid',
            source: 'video.mp4'
        });

        data = [
            {
                key: 0,
                start_time: 5,
                end_time: 60,
                type: 'vid',
                source: 'video.mp4'
            },
            {
                key: 1,
                start_time: 63,
                end_time: 64,
                type: 'vid',
                source: 'video.mp4'
            },
            {
                key: 2,
                start_time: 64,
                end_time: 70,
                type: 'vid',
                source: 'video.mp4'
            },
        ];
        expect(getCurrentItem(data, 3.2)).toBeNull;
        expect(getCurrentItem(data, 55)).toEqual({
            key: 0,
            start_time: 5,
            end_time: 60,
            type: 'vid',
            source: 'video.mp4'
        });
        expect(getCurrentItem(data, 60)).toEqual({
            key: 0,
            start_time: 5,
            end_time: 60,
            type: 'vid',
            source: 'video.mp4'
        });
        expect(getCurrentItem(data, 60.5)).toBeNull;
        expect(getCurrentItem(data, 63.88)).toEqual({
            key: 1,
            start_time: 63,
            end_time: 64,
            type: 'vid',
            source: 'video.mp4'
        });
        expect(getCurrentItem(data, 75)).toBeNull;
    });
});
