import React from 'react';
import TestUtils from 'react-addons-test-utils';
import JuxtaposeApplication from '../src/JuxtaposeApplication.jsx';

describe('JuxtaposeApplication.getItem', () => {
    it('returns the expected output', () => {
        const app = TestUtils.renderIntoDocument(
            <JuxtaposeApplication />
        );
        expect(app.getItem(null)).toBeNull;

        expect(app.getItem(['txt', 0])).toEqual({
            'key': 0,
            'startTime': 5,
            'endTime': 40,
            'type': 'txt',
            'source': 'Lorem ipsum dolor sit amet, consectetur adipiscing ' +
                'elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim'
        });
        expect(app.getItem(['txt', 1])).toEqual({
            'key': 1,
            'startTime': 45,
            'endTime': 55,
            'type': 'txt',
            'source': 'Duis aute irure dolor in reprehenderit in voluptate ' +
                'velit esse cillum dolore eu fugiat nulla pariatur. ' +
                'Excepteur sint occaecat cupidatat non'
        });
        expect(app.getItem(['media', 3])).toEqual({
            'key': 3,
            'startTime': 38,
            'endTime': 55,
            'type': 'img',
            'source': 'static/img/image.jpg'
        });
    });
});
