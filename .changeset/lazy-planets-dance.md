---
'livepeer': minor
---

The `livepeer` package is now comprised of five main groups:

- **actions:** functions to write/read from Livepeer Media Server (LPMS) providers and the Livepeer protocol smart contracts
- **client:** the singleton LPMS provider with persistence to local storage and global state management
- **constants:** constants for the Studio LPMS provider (and future providers) and protocol contract addresses/ABIs/chain IDs
- **errors:** custom errors for livepeer.js
- **types:** Typescript typings for the LPMS provider interface, Typechain-generated types for protocol contracts, and utility types

### Actions

```diff
+ import {
+   createAsset,
+   createStream,
+   getAsset,
+   getBondingManager,
+   getContractAddressFromController,
+   getController,
+   getL1Migrator,
+   getL2Migrator,
+   getLivepeerToken,
+   getLivepeerTokenFaucet,
+   getLPMSProvider,
+   getMerkleSnapshot,
+   getMinter,
+   getPollCreator,
+   getRoundsManager,
+   getServiceRegistry,
+   getStream,
+   getStreamSession,
+   getStreamSessions,
+   getTicketBroker,
+   updateAsset,
+   updateStream,
+   watchLPMSProvider,
+ } from 'livepeer';
+
+ import type {
+   GetLPMSProviderResult,
+   WatchLPMSProviderCallback,
+ } from 'livepeer';
```

### Client

```diff
+ import { Client, createClient } from 'livepeer';
+ import type { ClientConfig } from 'livepeer';
```

### Constants

```diff
+ import {
+   allChainId,
+   allLPMS,
+   arbitrumOneAddress,
+   arbitrumRinkebyAddress,
+   ArbRetryableTxABI,
+   BondingManagerABI,
+   ControllerABI,
+   defaultLPMS,
+   defaultTranscodingProfiles,
+   InboxABI,
+   L1BondingManagerABI,
+   L1MigratorABI,
+   L2LPTGatewayABI,
+   L2MigratorABI,
+   LivepeerTokenABI,
+   LivepeerTokenFaucetABI,
+   lpms,
+   mainnetAddress,
+   mainnetChainId,
+   MerkleSnapshotABI,
+   MinterABI,
+   NodeInterfaceABI,
+   PollABI,
+   PollCreatorABI,
+   rinkebyAddress,
+   RoundsManagerABI,
+   ServiceRegistryABI,
+   studio,
+   testnetChainId,
+   TicketBrokerABI,
+ } from 'livepeer';
+
+ import type {
+   L1Address,
+   L1LivepeerChain,
+   L1LivepeerChainId,
+   L2Address,
+   L2LivepeerChain,
+   L2LivepeerChainId,
+   LivepeerAddress,
+   LivepeerChain,
+   LivepeerChainId,
+   LPMSName,
+   MainnetLivepeerChain,
+   MainnetLivepeerChainId,
+   TestnetLivepeerChain,
+   TestnetLivepeerChainId,
+ } from 'livepeer';
```

### Types

```diff
+ import {
+   ArbRetryableTxFactory,
+   BondingManagerFactory,
+   ControllerFactory,
+   InboxFactory,
+   L1BondingManagerFactory,
+   L1MigratorFactory,
+   L2LPTGatewayFactory,
+   L2MigratorFactory,
+   LivepeerTokenFactory,
+   LivepeerTokenFaucetFactory,
+   MerkleSnapshotFactory,
+   MinterFactory,
+   NodeInterfaceFactory,
+   PollCreatorFactory,
+   PollFactory,
+   RoundsManagerFactory,
+   ServiceRegistryFactory,
+   TicketBrokerFactory,
+ } from 'livepeer';
+
+ import type {
+   Address,
+   ArbRetryableTx,
+   Asset,
+   BondingManager,
+   Controller,
+   CreateAssetArgs,
+   CreateStreamArgs,
+   GetAssetArgs,
+   GetStreamArgs,
+   GetStreamSessionArgs,
+   GetStreamSessionsArgs,
+   Hash,
+   Inbox,
+   Ipfs,
+   L1BondingManager,
+   L1Migrator,
+   L2LPTGateway,
+   L2Migrator,
+   LivepeerToken,
+   LivepeerTokenFaucet,
+   LPMS,
+   LPMSProvider,
+   MerkleSnapshot,
+   Minter,
+   NodeInterface,
+   Poll,
+   PollCreator,
+   RoundsManager,
+   ServiceRegistry,
+   Stream,
+   StreamSession,
+   TicketBroker,
+   TranscodingProfile,
+   UpdateAssetArgs,
+   UpdateStreamArgs,
+ } from 'livepeer';
```
