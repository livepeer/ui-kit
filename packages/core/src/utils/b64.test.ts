import { describe, expect, it } from 'vitest';

import { b64UrlDecode, b64UrlEncode } from './b64';

describe('b64', () => {
  describe('encodes', () => {
    it('correctly encodes a precomputed value', () => {
      expect(b64UrlEncode('somevalue')).toMatchInlineSnapshot('"c29tZXZhbHVl"');
    });
  });

  describe('decodes', () => {
    it('correctly decodes a precomputed value', () => {
      expect(b64UrlDecode('c29tZXZhbHVl')).toMatchInlineSnapshot('"somevalue"');
    });
  });
});
