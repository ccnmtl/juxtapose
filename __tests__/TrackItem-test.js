jest.unmock('../src/TrackItem.jsx');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TrackItem from '../src/TrackItem.jsx';

describe('TrackItem', () => {
    it('calculates the correct style', () => {
        const trackItem = TestUtils.renderIntoDocument(
            <TrackItem data={{
                key: 0,
                startTime: 5,
                endTime: 60,
                type: 'txt',
                source: 'Some text!'
                }}
            duration={100} />
        );
        let style = trackItem.calcStyle();
        expect(style.left).toBe('30px');
        expect(style.width).toBe('330px');
    });
});
