/* eslint-env jest */

import Xhr from '../src/Xhr.js';

describe('Xhr', () => {
    it('can be initialized', () => {
        new Xhr();
    });
});

describe('createOrUpdateSequenceAsset', () => {
    it('can be called with expected params', () => {
        const xhr = new Xhr();
        xhr.createOrUpdateSequenceAsset(
            1, 50, 2, 3,
            [], []);
    });
    it('can be called with bogus volume', () => {
        const xhr = new Xhr();
        xhr.createOrUpdateSequenceAsset(
            1, null, 2, 3,
            [], []);
        xhr.createOrUpdateSequenceAsset(
            1, undefined, 2, 3,
            [], []);
        xhr.createOrUpdateSequenceAsset(
            1, 'jfiejfffj', 2, 3,
            [], []);
        xhr.createOrUpdateSequenceAsset(
            1, 58.385, 2, 3,
            [], []);
    });
});

describe('createSequenceAsset', () => {
    it('can be called with expected params', () => {
        const xhr = new Xhr();
        xhr.createSequenceAsset(
            1, 50, 2, 3,
            [], []);
    });
    it('can be called with bogus volume', () => {
        const xhr = new Xhr();
        xhr.createSequenceAsset(
            1, null, 2, 3,
            [], []);
        xhr.createSequenceAsset(
            1, undefined, 2, 3,
            [], []);
        xhr.createSequenceAsset(
            1, 'jfiejfffj', 2, 3,
            [], []);
        xhr.createSequenceAsset(
            1, 58.385, 2, 3,
            [], []);
    });
});

describe('updateSequenceAsset', () => {
    it('can be called with expected params', () => {
        const xhr = new Xhr();
        xhr.updateSequenceAsset(
            1, 1, 50, 2, 3,
            [], []);
    });
    it('can be called with bogus volume', () => {
        const xhr = new Xhr();
        xhr.updateSequenceAsset(
            1, 1, null, 2, 3,
            [], []);
        xhr.updateSequenceAsset(
            1, 1, undefined, 2, 3,
            [], []);
        xhr.updateSequenceAsset(
            1, 1, 'jfiejfffj', 2, 3,
            [], []);
        xhr.updateSequenceAsset(
            1, 1, 58.385, 2, 3,
            [], []);
    });
});
