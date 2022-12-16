import { describe, expect, it } from 'vitest';

import { omit, pick } from './omick';

const randomFunction = () => {
  return 1;
};

describe('pick', () => {
  describe('args', () => {
    it('picks one arg', () => {
      const stronglyTypedObject = {
        key1: 'somekey',
        key2: 'anotherkey',
      };
      const result = pick(stronglyTypedObject, 'key1');
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
      const result = pick(stronglyTypedObject, 'key1', 'key2');
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
      const result = pick(stronglyTypedObject, 'key1', 'key2');
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
      const result = pick(stronglyTypedObject, 'func', 'key2');
      expect(result).toMatchInlineSnapshot(`
        {
          "func": [Function],
          "key2": "anotherkey",
        }
      `);
    });
  });
});

describe('omit', () => {
  describe('args', () => {
    it('picks one arg', () => {
      const stronglyTypedObject = {
        key1: 'somekey',
        key2: 'anotherkey',
      };
      const result = omit(stronglyTypedObject, 'key2');
      expect(result).toEqual({
        key1: 'somekey',
      });
    });
  });
});
