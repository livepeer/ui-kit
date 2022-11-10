import { expect, it } from 'vitest';

import * as Exports from '.';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "Context",
      "LivepeerConfig",
      "ThemeProvider",
      "useClient",
      "useTheme",
      "MediaControllerContext",
      "MediaControllerProvider",
      "useMediaController",
    ]
  `);
});
