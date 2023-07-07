import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "DEFAULT_AUTOHIDE_TIME",
      "DEFAULT_VOLUME_LEVEL",
      "addMediaMetricsToStore",
      "aspectRatios",
      "createControllerStore",
      "getMediaSourceType",
      "sanitizeMediaControllerState",
    ]
  `);
});
