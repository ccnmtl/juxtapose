/* eslint-env jest */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import JuxtaposeApplication from '../src/JuxtaposeApplication.jsx';
import {mediaTrackData, textTrackData} from '../src/data.js';

describe('JuxtaposeApplication.getItem', () => {
    it('returns the expected output', () => {
        const app = ReactTestUtils.renderIntoDocument(
            <JuxtaposeApplication />
        );
        app.setState({
            'mediaTrack': mediaTrackData,
            'textTrack': textTrackData
        })
        expect(app.getItem(null)).toBeNull;

        expect(app.getItem(['txt', 0])).toEqual({
            'key': 0,
            'start_time': 5,
            'end_time': 40,
            'type': 'txt',
            'source': 'Lorem ipsum dolor sit amet, consectetur adipiscing ' +
                'elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim'
        });
        expect(app.getItem(['txt', 1])).toEqual({
            'key': 1,
            'start_time': 45,
            'end_time': 55,
            'type': 'txt',
            'source': 'Duis aute irure dolor in reprehenderit in voluptate ' +
                'velit esse cillum dolore eu fugiat nulla pariatur. ' +
                'Excepteur sint occaecat cupidatat non'
        });
        expect(app.getItem(['media', 3])).toEqual({
            'key': 3,
            'id': 4,
            'start_time': 38,
            'end_time': 55,
            'type': 'img',
            'source': 'static/img/image.jpg'
        });
    });
});
