import React from 'react';
import TestUtils from 'react-addons-test-utils';
import PlayButton from '../src/PlayButton.jsx';

describe('PlayButton', () => {
    it('changes state after click', () => {
        let onClick = function() {};

        const playButton = TestUtils.renderIntoDocument(
                <PlayButton isPlaying={false} onClick={onClick} />
        );
        expect(playButton.props.isPlaying).toBe(false);

        // TODO: assert that onClick was called
    });
});
