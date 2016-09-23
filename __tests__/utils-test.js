import {formatDuration, pad2} from '../src/utils.js';

describe('formatDuration', () => {
    it('formats seconds correctly', () => {
        expect(formatDuration(0)).toBe('00:00:00');
        expect(formatDuration(55)).toBe('00:55:00');
        expect(formatDuration(60)).toBe('01:00:00');
        expect(formatDuration(81)).toBe('01:21:00');
        expect(formatDuration(9999)).toBe('166:39:00');
    });
    it('formats microseconds correctly', () => {
        expect(formatDuration(0.2398572)).toBe('00:00:24');
        expect(formatDuration(55.1871)).toBe('00:55:19');
        expect(formatDuration(60.1241)).toBe('01:00:12');
        expect(formatDuration(81.3299)).toBe('01:21:33');
        expect(formatDuration(9999.114)).toBe('166:39:11');
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
