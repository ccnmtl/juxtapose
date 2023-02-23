/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';
import PlayButton from '../src/PlayButton.jsx';

it('changes state after click', () => {
    const onClick = jest.fn();
    const component = renderer.create(
        <PlayButton playing={false} onClick={onClick} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    renderer.act(() => {
        tree.props.onClick();
    });
    expect(onClick).toHaveBeenCalled();
});
