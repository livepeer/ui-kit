# livepeer

## 0.2.2

### Patch Changes

- [#5](https://github.com/livepeer/livepeer.js/pull/5) [`97c56f6`](https://github.com/livepeer/livepeer.js/commit/97c56f64b18f62c6b417e35ac27834747b7a0c20) Thanks [@0xcadams](https://github.com/0xcadams)! - Updated the default studio API key to use a new, tracked (and rate-limited) version.

  ```diff
  -export const defaultStudioApiKey = '182188f3-3ddf-4dc2-9889-79ecb17a26c9';
  +export const defaultStudioApiKey = '4991930c-f9ae-46a0-a2a8-488c466da778';
  ```

  Updated the types on `CreateAssetArgs` to include `ReadStream` for node.js environments.

  ```diff
  export type CreateAssetArgs = {
    name: string;

  - file: File;
  + file: File | ReadStream;
    };
  ```

## 0.2.1

### Patch Changes

- [#3](https://github.com/livepeer/livepeer.js/pull/3) [`1c38dcd`](https://github.com/livepeer/livepeer.js/commit/1c38dcde2a7abce7a7785bcd6880ab6f71f0e0e4) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the term "LPMS" from the library and replaced a "LPMS Provider" with a "Livepeer Provider".

  See below for the API changes:

  ```diff
  import {
    getL2Migrator,
    getLivepeerToken,
    getLivepeerTokenFaucet,
  - getLPMSProvider,
  + getLivepeerProvider,
    getMerkleSnapshot,
    getMinter,
    ...
    updateAsset,
    updateStream,
  - watchLPMSProvider,
  + watchLivepeerProvider,
    ...
  - GetLPMSProviderResult,
  - WatchLPMSProviderCallback,
  + GetLivepeerProviderResult,
  + WatchLivepeerProviderCallback,
    ...
    allChainId,
  - allLPMS,
    arbitrumOneAddress,
    arbitrumRinkebyAddress,
    ArbRetryableTxABI,
    BondingManagerABI,
    ControllerABI,
  - defaultLPMS,
  + defaultStudioApiKey,
    defaultTranscodingProfiles,
    InboxABI,
    L1BondingManagerABI,
    ...
    L2MigratorABI,
    LivepeerTokenABI,
    LivepeerTokenFaucetABI,
  + lpms,
    mainnetAddress,
    mainnetChainId,
    MerkleSnapshotABI,
    ...
    LivepeerAddress,
    LivepeerChain,
    LivepeerChainId,
  - LPMSName,
  + LivepeerProviderName,
    MainnetLivepeerChain,
    MainnetLivepeerChainId,
    TestnetLivepeerChain,
    ...
    L1Migrator,
    L2LPTGateway,
    L2Migrator,
  + LivepeerProvider,
  + LivepeerProviderConfig,
    LivepeerToken,
    LivepeerTokenFaucet,
  - LPMS,
  - LPMSProvider,
    MerkleSnapshot,
    Minter,
    ...
  } from "livepeer";
  ```

## 0.2.0

### Minor Changes

- [`ebd1587`](https://github.com/livepeer/livepeer.js/commit/ebd15872cf7ac48a092ad88ea3a470a1c788e223) Thanks [@0xcadams](https://github.com/0xcadams)! - The `livepeer` package is now comprised of five main groups:

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
