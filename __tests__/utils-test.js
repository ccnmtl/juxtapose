jest.unmock('../src/utils.js');

import {formatDuration, pad2} from '../src/utils.js';

describe('formatDuration', () => {
    it('formats seconds correctly', () => {
        expect(formatDuration(0)).toBe('00:00');
        expect(formatDuration(55)).toBe('00:55');
        expect(formatDuration(60)).toBe('01:00');
        expect(formatDuration(81)).toBe('01:21');
    });
});

describe('pad2', () => {
    it('pads a low number with a zero', () => {
        expect(pad2(0)).toBe('00');
        expect(pad2(4)).toBe('04');
    });
    it('doesn\'t pad high numbers', () => {
        expect(pad2(10)).toBe('10');
        expect(pad2(99)).toBe('99');
        expect(pad2(100)).toBe('100');
    });
});
