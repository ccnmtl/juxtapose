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
            'endTime': 60,
            'type': 'txt',
            'source': 'Lorem ipsum dolor sit amet, consectetur adipiscing ' +
                'elit, sed do eiusmod tempor incididunt ut labore et ' +
                'dolore magna aliqua. Ut enim ad minim veniam, quis ' +
                'nostrud exercitation ullamco laboris nisi ut aliquip ex ' +
                'ea commodo consequat.'
        });
        expect(app.getItem(['txt', 1])).toEqual({
            'key': 1,
            'startTime': 70,
            'endTime': 80,
            'type': 'txt',
            'source': 'Duis aute irure dolor in reprehenderit in voluptate ' +
                'velit esse cillum dolore eu fugiat nulla pariatur. ' +
                'Excepteur sint occaecat cupidatat non proident, sunt ' +
                'in culpa qui officia deserunt mollit anim id est laborum.'
        });
        expect(app.getItem(['aux', 1])).toEqual({
            'key': 1,
            'startTime': 38,
            'endTime': 55,
            'type': 'img',
            'source': 'img/image.jpg'
        });
    });
});
