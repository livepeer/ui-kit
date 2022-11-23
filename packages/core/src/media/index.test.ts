import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "addMediaMetricsToStore",
      "aspectRatios",
      "createControllerStore",
      "getMediaSourceType",
    ]
  `);
});
