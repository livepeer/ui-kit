import { describe, expect, it } from 'vitest';

import { b64Decode, b64Encode, b64UrlDecode, b64UrlEncode } from './string';

describe('b64', () => {
  describe('default', () => {
    describe('encodes', () => {
      it('correctly encodes a precomputed value', () => {
        expect(b64Encode('somevalue')).toMatchInlineSnapshot('"c29tZXZhbHVl"');
      });
    });

    describe('decodes', () => {
      it('correctly decodes a precomputed value', () => {
        expect(b64Decode('c29tZXZhbHVl')).toMatchInlineSnapshot('"somevalue"');
      });

      it('returns null on invalid value', () => {
        expect(b64Decode('------')).toEqual(null);
      });

      it('returns null on invalid value', () => {
        expect(b64Decode('\\\\\\')).toEqual(null);
      });
    });
  });

  describe('url', () => {
    describe('encodes', () => {
      it('correctly encodes a precomputed value', () => {
        expect(b64UrlEncode('somevalue')).toMatchInlineSnapshot(
          '"c29tZXZhbHVl"',
        );
      });
    });

    describe('decodes', () => {
      it('correctly decodes a precomputed value', () => {
        expect(b64UrlDecode('c29tZXZhbHVl')).toMatchInlineSnapshot(
          '"somevalue"',
        );
      });

      it('returns null on invalid value', () => {
        expect(b64UrlDecode('\\\\\\')).toEqual(null);
      });
    });
  });
});
