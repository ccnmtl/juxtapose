/* eslint-env jest */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TimelineRuler from '../src/TimelineRuler.jsx';

describe('TimelineRuler', () => {
    it('can be initialized', () => {
        const timelineRuler = TestUtils.renderIntoDocument(
                <TimelineRuler duration={0} />);
        expect(timelineRuler.props.duration).toBe(0);
    });
    it('calculates correct offsets for timeline ticks', () => {
        const timelineRuler = TestUtils.renderIntoDocument(
                <TimelineRuler duration={0} />);

        expect(timelineRuler.generateTicks(0)).toEqual([[100, 0]]);
        expect(timelineRuler.generateTicks(8889)).toEqual([
            [0, 0],
            [14.962312971087863, 1330],
            [29.924625942175727, 2660],
            [44.886938913263585, 3990],
            [59.84925188435145, 5320],
            [74.8115648554393, 6650],
            [89.77387782652717, 7980],
            [100, 8889]
        ]);
        expect(timelineRuler.generateTicks(37)).toEqual([
            [0, 0],
            [81.08108108108108, 30],
            [100, 37]
        ]);
    });
});
