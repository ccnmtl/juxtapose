import {formatDuration, pad2} from '../src/utils.js';

describe('formatDuration', () => {
    it('formats seconds correctly', () => {
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(55)).toBe('0:55');
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(81)).toBe('1:21');
        expect(formatDuration(9999)).toBe('166:39');
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
