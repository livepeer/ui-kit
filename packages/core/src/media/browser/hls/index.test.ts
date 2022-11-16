import { expect, it } from 'vitest';

import * as Exports from '.';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "VIDEO_HLS_INITIALIZED_ATTRIBUTE",
      "createNewHls",
      "isHlsSupported",
    ]
  `);
});
