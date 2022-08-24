import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createReactClient",
      "Context",
      "LivepeerConfig",
      "useClient",
      "VideoPlayer",
      "useAsset",
      "useBondingManager",
      "useController",
      "useCreateAsset",
      "useCreateStream",
      "useL1Migrator",
      "useL2Migrator",
      "useLivepeerToken",
      "useLivepeerTokenFaucet",
      "useLivepeerProvider",
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
