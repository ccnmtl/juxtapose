import {extractAssetData, formatTimecode, pad2} from '../src/utils.js';

describe('extractAssetData', () => {
    it('handles bogus input', () => {
        expect(extractAssetData('').id).toBe(null);
        expect(extractAssetData('').annotationId).toBe(null);
        expect(extractAssetData(null).id).toBe(null);
        expect(extractAssetData(null).annotationId).toBe(null);
    });
    it('extracts the url correctly', () => {
        expect(extractAssetData('/asset/124567/').id).toBe(124567);
        expect(extractAssetData('/asset/124567/').annotationId).toBe(null);
        expect(extractAssetData(
            '/asset/124567/annotations/15161/').id).toBe(124567);
        expect(extractAssetData(
            '/asset/124567/annotations/15161/').annotationId).toBe(15161);
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
        expect(formatTimecode(0.2398572)).toBe('00:00:24');
        expect(formatTimecode(55.1871)).toBe('00:55:19');
        expect(formatTimecode(60.1241)).toBe('01:00:12');
        expect(formatTimecode(81.3299)).toBe('01:21:33');
        expect(formatTimecode(9999.114)).toBe('166:39:11');
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
