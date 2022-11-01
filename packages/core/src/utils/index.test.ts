import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "deepMerge",
      "pick",
      "noop",
      "notEqual",
      "equal",
      "isNull",
      "isUndefined",
      "isNil",
      "isObject",
      "isNumber",
      "isString",
      "isBoolean",
      "isFunction",
      "isArray",
      "isWindow",
      "isReactNative",
      "warn",
    ]
  `);
});
