import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createReactClient",
      "FullscreenButton",
      "MediaControllerProvider",
      "PlayButton",
      "Progress",
      "TimeDisplay",
      "useMediaController",
      "VideoPlayer",
      "Volume",
      "Context",
      "LivepeerConfig",
      "useClient",
      "useAsset",
      "useBondingManager",
      "useController",
      "useCreateAsset",
      "useCreateStream",
      "useL1Migrator",
      "useL2Migrator",
      "useLivepeerProvider",
      "useLivepeerToken",
      "useLivepeerTokenFaucet",
      "useMerkleSnapshot",
      "useMinter",
      "usePollCreator",
      "useRoundsManager",
      "useServiceRegistry",
      "useStream",
      "useStreamSession",
      "useStreamSessions",
      "useTicketBroker",
      "useUpdateAsset",
      "useUpdateStream",
      "deserialize",
      "serialize",
    ]
  `);
});
