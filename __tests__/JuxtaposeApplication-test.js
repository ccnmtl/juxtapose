/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';
import JuxtaposeApplication from '../src/JuxtaposeApplication.jsx';

describe('JuxtaposeApplication', () => {
    it('returns the expected output', () => {
        const component = renderer.create(
            <JuxtaposeApplication readOnly={false} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
