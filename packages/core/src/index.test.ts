import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createAsset",
      "createStream",
      "getAsset",
      "getAssetMetrics",
      "getBondingManager",
      "getContractAddressFromController",
      "getController",
      "getL1Migrator",
      "getL2Migrator",
      "getLivepeerProvider",
      "getLivepeerToken",
      "getLivepeerTokenFaucet",
      "getMerkleSnapshot",
      "getMinter",
      "getPlaybackInfo",
      "getPollCreator",
      "getRoundsManager",
      "getServiceRegistry",
      "getStream",
      "getStreamSession",
      "getStreamSessions",
      "getTicketBroker",
      "updateAsset",
      "updateStream",
      "watchLivepeerProvider",
      "Client",
      "createClient",
      "allChainId",
      "arbitrumOneAddress",
      "arbitrumRinkebyAddress",
      "ArbRetryableTxABI",
      "BondingManagerABI",
      "ControllerABI",
      "defaultStudioApiKey",
      "defaultTranscodingProfiles",
      "InboxABI",
      "L1BondingManagerABI",
      "L1MigratorABI",
      "L2LPTGatewayABI",
      "L2MigratorABI",
      "LivepeerTokenABI",
      "LivepeerTokenFaucetABI",
      "mainnetAddress",
      "mainnetChainId",
      "MerkleSnapshotABI",
      "MinterABI",
      "NodeInterfaceABI",
      "PollABI",
      "PollCreatorABI",
      "rinkebyAddress",
      "RoundsManagerABI",
      "ServiceRegistryABI",
      "studio",
      "testnetChainId",
      "TicketBrokerABI",
      "HttpError",
      "IncorrectChainIdError",
      "addEventListeners",
      "createControllerStore",
      "createNewHls",
      "createPlayerTheme",
      "defaultTheme",
      "getMetricsReportingUrl",
      "isHlsSupported",
      "MetricsStatus",
      "PlaybackMonitor",
      "reportMediaMetrics",
      "styling",
      "createStorage",
      "noopStorage",
      "ArbRetryableTxFactory",
      "BondingManagerFactory",
      "ControllerFactory",
      "InboxFactory",
      "L1BondingManagerFactory",
      "L1MigratorFactory",
      "L2LPTGatewayFactory",
      "L2MigratorFactory",
      "LivepeerTokenFactory",
      "LivepeerTokenFaucetFactory",
      "MerkleSnapshotFactory",
      "MinterFactory",
      "NodeInterfaceFactory",
      "PollCreatorFactory",
      "PollFactory",
      "RoundsManagerFactory",
      "ServiceRegistryFactory",
      "TicketBrokerFactory",
      "pick",
    ]
  `);
});
