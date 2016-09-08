import React from 'react';
import TestUtils from 'react-addons-test-utils';
import PlayButton from '../src/PlayButton.jsx';

describe('PlayButton', () => {
    it('changes state after click', () => {
        const playButton = TestUtils.renderIntoDocument(
            <PlayButton />
        );
        expect(playButton.state.play).toBe(false);

        // Simulate a click and verify that it is now true
        TestUtils.Simulate.click(
            TestUtils.findRenderedDOMComponentWithTag(playButton, 'button')
        );
        expect(playButton.state.play).toBe(true);

        TestUtils.Simulate.click(
            TestUtils.findRenderedDOMComponentWithTag(playButton, 'button')
        );
        expect(playButton.state.play).toBe(false);
    });
});
