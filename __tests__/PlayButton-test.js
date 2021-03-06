/* eslint-env jest */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import PlayButton from '../src/PlayButton.jsx';

describe('PlayButton', () => {
    it('changes state after click', () => {
        let onClick = function() {};

        const playButton = ReactTestUtils.renderIntoDocument(
                <PlayButton playing={false} onClick={onClick} />
        );
        expect(playButton.props.playing).toBe(false);

        // TODO: assert that onClick was called
    });
});
