import { describe, expect, it } from 'vitest';

import { pick } from './pick';

const randomFunction = () => {
  return 1;
};

describe('pick', () => {
  describe('args', () => {
    it('picks one arg', () => {
      const stronglyTypedObject = {
        key1: 'somekey',
        key2: 'anotherkey',
      } as const;
      const result = pick(stronglyTypedObject, ['key1']);
      expect(result).toEqual({
        key1: 'somekey',
      });
    });

    it('picks multiple args', () => {
      const stronglyTypedObject = {
        key1: 'somekey',
        key2: 'anotherkey',
        missingKey: 'someotherkey',
      } as const;
      const result = pick(stronglyTypedObject, ['key1', 'key2']);
      expect(result).toMatchInlineSnapshot(`
        {
          "key1": "somekey",
          "key2": "anotherkey",
        }
      `);
    });

    it('picks multiple args', () => {
      const stronglyTypedObject = {
        key1: 'somekey',
        key2: 'anotherkey',
        missingKey: 'someotherkey',
      } as const;
      const result = pick(stronglyTypedObject, ['key1', 'key2']);
      expect(result).toMatchInlineSnapshot(`
          {
            "key1": "somekey",
            "key2": "anotherkey",
          }
        `);
    });

    it('picks functions', () => {
      const stronglyTypedObject = {
        func: randomFunction,
        key2: 'anotherkey',
        missingKey: 'someotherkey',
      } as const;
      const result = pick(stronglyTypedObject, ['func', 'key2']);
      expect(result).toMatchInlineSnapshot(`
        {
          "func": [Function],
          "key2": "anotherkey",
        }
      `);
    });
  });
});
