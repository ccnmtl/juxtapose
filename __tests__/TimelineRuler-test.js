/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';
import TimelineRuler from '../src/TimelineRuler.jsx';

describe('TimelineRuler', () => {
    it('can be initialized', () => {
        const component = renderer.create(
            <TimelineRuler hovering={false} duration={0} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('calculates correct offsets for timeline ticks', () => {
        const component = renderer.create(
            <TimelineRuler hovering={false} duration={0} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
