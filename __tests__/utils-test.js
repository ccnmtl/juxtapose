import {
    collisionPresent, constrainEndTimeToAvailableSpace,
    elementsCollide, formatTimecode, pad2,
    getSeparatedTimeUnits, parseTimecode
} from '../src/utils.js';

describe('collisionPresent', () => {
    it('handles an empty track', () => {
        expect(collisionPresent([], 30, 1, 2)).toBe(false);
        expect(collisionPresent([], 30, 0, 2)).toBe(false);
        expect(collisionPresent([], 30, 0, 99)).toBe(true);
    });
    it('correctly detects collisions', () => {
        expect(collisionPresent([{
            start_time: 0.22,
            end_time: 0.66
        }], 30, 0, 0.23)).toBe(true);

        expect(collisionPresent([{
            start_time: 0.22,
            end_time: 0.66
        }], 30, 0.78, 1)).toBe(false);

        expect(collisionPresent([
            {
                start_time: 0.22,
                end_time: 0.66
            },
            {
                start_time: 0.68,
                end_time: 1
            },
            {
                start_time: 1.2,
                end_time: 11
            }
        ], 30, 0.78, 1)).toBe(true);

        expect(collisionPresent([
            {
                start_time: 0.22,
                end_time: 0.66
            },
            {
                start_time: 0.68,
                end_time: 1
            },
            {
                start_time: 1.2,
                end_time: 11
            }
        ], 30, 1.1, 1.15)).toBe(false);
    });
});

describe('constrainEndTimeToAvailableSpace', () => {
    it('handles empty track data', () => {
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, [])
        ).toBe(0.66);
        expect(
            constrainEndTimeToAvailableSpace(0.22, 11, 10, [])
        ).toBe(10);
        expect(
            constrainEndTimeToAvailableSpace(5, 9, 10, [])
        ).toBe(9);
    });
    it('correctly detects collisions', () => {
        let track = [{
            start_time: 0,
            end_time: 0.23
        }];
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, track)
        ).toBe(0);

        track = [{
            start_time: 0.5,
            end_time: 5
        }];
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, track)
        ).toBe(0.5);

        track = [
            {
                start_time: 0.5,
                end_time: 5
            }, {
                start_time: 6,
                end_time: 8
            }
        ];
        expect(
            constrainEndTimeToAvailableSpace(5.5, 88, 10, track)
        ).toBe(6);
        expect(
            constrainEndTimeToAvailableSpace(5.1, 6, 10, track)
        ).toBe(6);
    });
    it('ignore element at passed index', () => {
        let track = [
            {start_time: 0, end_time: 23},
            {start_time: 24, end_time: 34},
            {start_time: 36, end_time: 45}
        ];
        expect(
            constrainEndTimeToAvailableSpace(0, 28, 45, track, 0)
        ).toBe(24);
        expect(
            constrainEndTimeToAvailableSpace(0, 18, 45, track, 0)
        ).toBe(18);
        expect(
            constrainEndTimeToAvailableSpace(24, 40, 45, track, 1)
        ).toBe(36);
    });
});

describe('elementsCollide', () => {
    it('correctly detects collisions', () => {
        let e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        let e2 = {
            start_time: 0,
            end_time: 0.23
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0.5,
            end_time: 0.6
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0.5,
            end_time: 1
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0,
            end_time: 0.2
        };
        expect(elementsCollide(e1, e2)).toBe(false);
        expect(elementsCollide(e2, e1)).toBe(false);
    });
});

describe('formatTimecode', () => {
    it('formats seconds correctly', () => {
        expect(formatTimecode(0)).toBe('00:00:00');
        expect(formatTimecode(55)).toBe('00:55:00');
        expect(formatTimecode(60)).toBe('01:00:00');
        expect(formatTimecode(81)).toBe('01:21:00');
        expect(formatTimecode(9999)).toBe('166:39:00');
    });
    it('formats centiseconds correctly', () => {
        expect(formatTimecode(0.2398572)).toBe('00:00:23');
        expect(formatTimecode(55.1871)).toBe('00:55:18');
        expect(formatTimecode(60.1241)).toBe('01:00:12');
        expect(formatTimecode(81.3299)).toBe('01:21:32');
        expect(formatTimecode(9999.114)).toBe('166:39:11');
        expect(formatTimecode(1.999602)).toBe('00:01:99');
    });
});

describe('parseTimecode', () => {
    it('parses timecodes correctly', () => {
        expect(parseTimecode('00:00:00')).toBe(0);
        expect(parseTimecode('00:55:00')).toBe(55);
        expect(parseTimecode('01:00:00')).toBe(60);
        expect(parseTimecode('01:21:00')).toBe(81);
        expect(parseTimecode('166:39:00')).toBe(9999);
        expect(parseTimecode('00:00:23')).toBe(0.23);
        expect(parseTimecode('00:55:18')).toBe(55.18);
        expect(parseTimecode('01:00:12')).toBe(60.12);
        expect(parseTimecode('01:21:32')).toBe(81.32);
        expect(parseTimecode('166:39:11')).toBe(9999.11);
        expect(parseTimecode('00:01:99')).toBe(1.99);
    });
    it('is flexible about zeroes', () => {
        expect(parseTimecode('00:00:0')).toBe(0);
        expect(parseTimecode('0:0:0')).toBe(0);
        expect(parseTimecode('0:00:0')).toBe(0);
        expect(parseTimecode('0:00:00')).toBe(0);
        expect(parseTimecode('0:55:00')).toBe(55);
        expect(parseTimecode('00:0:12')).toBe(0.12);
    });
});

describe('getSeparatedTimeUnits', () => {
    it('returns the correct values', () => {
        expect(getSeparatedTimeUnits(0)).toEqual([0, 0, 0]);
        expect(getSeparatedTimeUnits(0.01)).toEqual([0, 0, 1]);
        expect(getSeparatedTimeUnits(110.01)).toEqual([1, 50, 1]);
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
