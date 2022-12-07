import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ArbRetryableTxABI",
      "BondingManagerABI",
      "ControllerABI",
      "InboxABI",
      "L1BondingManagerABI",
      "L1MigratorABI",
      "L2LPTGatewayABI",
      "L2MigratorABI",
      "LivepeerTokenABI",
      "LivepeerTokenFaucetABI",
      "MerkleSnapshotABI",
      "MinterABI",
      "NodeInterfaceABI",
      "PollABI",
      "PollCreatorABI",
      "RoundsManagerABI",
      "ServiceRegistryABI",
      "TicketBrokerABI",
      "allChainId",
      "arbitrumOneAddress",
      "arbitrumRinkebyAddress",
      "mainnetAddress",
      "mainnetChainId",
      "rinkebyAddress",
      "testnetChainId",
    ]
  `);
});
