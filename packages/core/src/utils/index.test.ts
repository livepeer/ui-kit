import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "b64Decode",
      "b64Encode",
      "b64UrlDecode",
      "b64UrlEncode",
      "deepMerge",
      "equal",
      "isArray",
      "isBoolean",
      "isFunction",
      "isNil",
      "isNull",
      "isNumber",
      "isObject",
      "isString",
      "isUndefined",
      "isWindow",
      "noop",
      "notEqual",
      "omit",
      "parseArweaveTxId",
      "parseCid",
      "pick",
      "warn",
    ]
  `);
});
