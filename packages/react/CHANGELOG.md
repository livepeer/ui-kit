# @livepeer/react

## 1.2.0

### Minor Changes

- [#104](https://github.com/livepeer/livepeer.js/pull/104) [`39d277f`](https://github.com/livepeer/livepeer.js/commit/39d277f6147bae605e97d64a0f56c0a3f4651f28) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the `meta` field on an Asset (which is a custom field stored in the Studio provider and not replicated to IPFS) to reduce confusion around metadata fields.

### Patch Changes

- Updated dependencies [[`39d277f`](https://github.com/livepeer/livepeer.js/commit/39d277f6147bae605e97d64a0f56c0a3f4651f28)]:
  - livepeer@1.2.0

## 1.1.0

### Minor Changes

- [#98](https://github.com/livepeer/livepeer.js/pull/98) [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Feature:** added picture in picture support to the Livepeer player.

  We support both the [w3c](https://w3c.github.io/picture-in-picture/) standard (which most modern browsers support), as well as the [older Safari/iOS spec](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls). See the browsers which support Picture-in-Picture on [caniuse](https://caniuse.com/picture-in-picture).

  ```tsx
  <Player playbackId="6d7el73r1y12chxr" showPipButton />
  ```

- [#92](https://github.com/livepeer/livepeer.js/pull/92) [`e7348f4`](https://github.com/livepeer/livepeer.js/commit/e7348f4c16fbcd5448147516c086c182d842a552) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated dependencies and fixed exporting to have individual paths for smaller bundle size.

### Patch Changes

- [#95](https://github.com/livepeer/livepeer.js/pull/95) [`0b02851`](https://github.com/livepeer/livepeer.js/commit/0b02851ed86e4c6ab0e28b5f575181d62c8dc629) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** further changes to imports to change build config to be smaller.

- [#98](https://github.com/livepeer/livepeer.js/pull/98) [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Fix:** fixed fullscreen state updating properly when entering/exiting fullscreen.

- Updated dependencies [[`0b02851`](https://github.com/livepeer/livepeer.js/commit/0b02851ed86e4c6ab0e28b5f575181d62c8dc629), [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a), [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a), [`e7348f4`](https://github.com/livepeer/livepeer.js/commit/e7348f4c16fbcd5448147516c086c182d842a552)]:
  - livepeer@1.1.0

## 1.1.0-next.2

### Minor Changes

- [#98](https://github.com/livepeer/livepeer.js/pull/98) [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Feature:** added picture in picture support to the Livepeer player.

  We support both the [w3c](https://w3c.github.io/picture-in-picture/) standard (which most modern browsers support), as well as the [older Safari/iOS
  spec](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls).
  See the browsers which support Picture-in-Picture on
  [caniuse](https://caniuse.com/picture-in-picture).

  ```tsx
  <Player playbackId="6d7el73r1y12chxr" showPipButton />
  ```

### Patch Changes

- [#98](https://github.com/livepeer/livepeer.js/pull/98) [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Fix:** fixed fullscreen state updating properly when entering/exiting fullscreen.

- Updated dependencies [[`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a), [`5fc44a5`](https://github.com/livepeer/livepeer.js/commit/5fc44a56e9e5ee5790bb05e76e1e430c44aee02a)]:
  - livepeer@1.1.0-next.2

## 1.1.0-next.1

### Patch Changes

- [#95](https://github.com/livepeer/livepeer.js/pull/95) [`0b02851`](https://github.com/livepeer/livepeer.js/commit/0b02851ed86e4c6ab0e28b5f575181d62c8dc629) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** further changes to imports to change build config to be smaller.

- Updated dependencies [[`0b02851`](https://github.com/livepeer/livepeer.js/commit/0b02851ed86e4c6ab0e28b5f575181d62c8dc629)]:
  - livepeer@1.1.0-next.1

## 1.1.0-next.0

### Minor Changes

- [#92](https://github.com/livepeer/livepeer.js/pull/92) [`e7348f4`](https://github.com/livepeer/livepeer.js/commit/e7348f4c16fbcd5448147516c086c182d842a552) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated dependencies and fixed exporting to have individual paths for smaller bundle size.

### Patch Changes

- Updated dependencies [[`e7348f4`](https://github.com/livepeer/livepeer.js/commit/e7348f4c16fbcd5448147516c086c182d842a552)]:
  - livepeer@1.1.0-next.0

## 1.0.6

### Patch Changes

- [#90](https://github.com/livepeer/livepeer.js/pull/90) [`c61dff7`](https://github.com/livepeer/livepeer.js/commit/c61dff7fcaa58ebeb2c00c0cc03934a7fe7a894d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added fixes for Safari live streaming - live streams should now show the "live" indicator and bad playlists/media errors
  will now retry loading with backoff.

- [#84](https://github.com/livepeer/livepeer.js/pull/84) [`f014cfa`](https://github.com/livepeer/livepeer.js/commit/f014cfa1f1cd6d7ea026c615a60b5350c80b48e1) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added metadata customization to storage to allow for customizing the metadata which is saved when an Asset
  is uploaded to IPFS.
- Updated dependencies [[`c61dff7`](https://github.com/livepeer/livepeer.js/commit/c61dff7fcaa58ebeb2c00c0cc03934a7fe7a894d), [`f014cfa`](https://github.com/livepeer/livepeer.js/commit/f014cfa1f1cd6d7ea026c615a60b5350c80b48e1)]:
  - livepeer@1.0.4

## 1.0.5

### Patch Changes

- [#85](https://github.com/livepeer/livepeer.js/pull/85) [`adf52c5`](https://github.com/livepeer/livepeer.js/commit/adf52c5e0fb43676eb89db7244f896a41f4a5760) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed Safari flex not taking up entire parent container.

- Updated dependencies [[`adf52c5`](https://github.com/livepeer/livepeer.js/commit/adf52c5e0fb43676eb89db7244f896a41f4a5760)]:
  - livepeer@1.0.3

## 1.0.4

### Patch Changes

- [`d43c04a`](https://github.com/livepeer/livepeer.js/commit/d43c04ade7cfaf18800508a7da31d99b9989f931) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix**: added `PlayerObjectFit` type to exports.

- Updated dependencies [[`d43c04a`](https://github.com/livepeer/livepeer.js/commit/d43c04ade7cfaf18800508a7da31d99b9989f931)]:
  - livepeer@1.0.2

## 1.0.3

### Patch Changes

- [#77](https://github.com/livepeer/livepeer.js/pull/77) [`7c3dc0b`](https://github.com/livepeer/livepeer.js/commit/7c3dc0bc6967fd05aa660a9d878d693f7ea2603d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `objectFit` to `<Player />` to apply to the video/poster element, to either be `contain` or `cover` depending on the use-case.

## 1.0.2

### Patch Changes

- [#75](https://github.com/livepeer/livepeer.js/pull/75) [`73f37ad`](https://github.com/livepeer/livepeer.js/commit/73f37ad8ec312e949fb3420b48113896580f16de) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed too strict types on `<Player />`, background play/pause click handler not working without a poster element, theme overrides without a global theme, and styling for the container to take up the parent width and maintain aspect ratio.

- Updated dependencies [[`73f37ad`](https://github.com/livepeer/livepeer.js/commit/73f37ad8ec312e949fb3420b48113896580f16de)]:
  - livepeer@1.0.1

## 1.0.1

### Patch Changes

- [`a184505`](https://github.com/livepeer/livepeer.js/commit/a18450593e4f10d2622ffb70ea378c4c5f95dad5) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** hotfix for moving livepeer to dependency array from peer dependencies.

## 1.0.0

### Minor Changes

- [#42](https://github.com/livepeer/livepeer.js/pull/42) [`ea9d083`](https://github.com/livepeer/livepeer.js/commit/ea9d083869acf571af4cdc22a97b540f5c440f11) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added a new `<Player />` component and deprecated the previous `<VideoPlayer />`. Also added polyfills using `core-js` and `browserslist` to support major global browsers.

  See `livepeer` for the corresponding core JS updates.

  The following updates were made to the exports from `@livepeer/react`:

  ```diff
  export {
     arbitrumRinkebyAddress,
     ArbRetryableTxABI,
     BondingManagerABI,
  +  canPlayMediaNatively,
     Client,
     ControllerABI,
  +  createPlayerTheme,
     createStorage,
     defaultStudioApiKey,
  +  defaultTheme,
     defaultTranscodingProfiles,
  +  getCssText,
  +  getMediaSourceType,
     InboxABI,
  +  isHlsSupported,
     L1BondingManagerABI,
     L1MigratorABI,
     L2LPTGatewayABI,
  @@ -28,16 +34,20 @@ export {
     RoundsManagerABI,
     ServiceRegistryABI,
     studio,
  +  styling,
     testnetChainId,
     TicketBrokerABI,
   } from 'livepeer';
   export type {
     Address,
     ArbRetryableTx,
  +  AspectRatio,
     Asset,
  +  AudioSrc,
     BondingManager,
     ClientConfig,
     Controller,
  +  ControlsOptions,
     CreateAssetArgs,
     CreateStreamArgs,
     GetAssetArgs,
  @@ -47,6 +57,7 @@ export type {
     GetStreamSessionArgs,
     GetStreamSessionsArgs,
     Hash,
  +  HlsSrc,
     HlsVideoConfig,
     HttpError,
     Inbox,
  @@ -71,6 +82,8 @@ export type {
     LivepeerTokenFaucet,
     MainnetLivepeerChain,
     MainnetLivepeerChainId,
  +  MediaControllerState,
  +  MediaControllerStore,
     MerkleSnapshot,
     Metrics,
     Minter,
  @@ -83,15 +96,18 @@ export type {
     PollCreator,
     RoundsManager,
     ServiceRegistry,
  +  Src,
     Storage,
     Stream,
     StreamSession,
     TestnetLivepeerChain,
     TestnetLivepeerChainId,
  +  ThemeConfig,
     TicketBroker,
     TranscodingProfile,
     UpdateAssetArgs,
     UpdateStreamArgs,
  +  VideoSrc,
     WatchLivepeerProviderCallback,
   } from 'livepeer';
   export {
  @@ -100,7 +116,34 @@ export {
   } from 'livepeer/providers/studio';
   export { createReactClient } from './client';
   export type { CreateReactClientConfig, ReactClient } from './client';
  -export { VideoPlayer } from './components';
  +export {
  +  ControlsContainer,
  +  FullscreenButton,
  +  MediaControllerProvider,
  +  PlayButton,
  +  Player,
  +  Poster,
  +  Progress,
  +  ThemeProvider,
  +  TimeDisplay,
  +  Title,
  +  useMediaController,
  +  useTheme,
  +  Volume,
  +} from './components';
  +export type {
  +  ControlsContainerProps,
  +  FullscreenButtonProps,
  +  MediaControllerProviderProps,
  +  PlayButtonProps,
  +  PlayerProps,
  +  PosterProps,
  +  ProgressProps,
  +  ThemeProviderProps,
  +  TimeDisplayProps,
  +  TitleProps,
  +  VolumeProps,
  +} from './components';
   export { Context, LivepeerConfig, useClient } from './context';
   export type { LivepeerConfigProps } from './context';
   export {
  ```

- [#42](https://github.com/livepeer/livepeer.js/pull/42) [`ea9d083`](https://github.com/livepeer/livepeer.js/commit/ea9d083869acf571af4cdc22a97b540f5c440f11) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** moved all contract interactions to a separate subpackage, to remove the need for the `ethers`/`wagmi` peer dependencies.

  ```diff
  +import {
  +  useBondingManager,
  +  useController,
  +  useL1Migrator,
  +  useL2Migrator,
  +  useLivepeerToken,
  +  useLivepeerTokenFaucet,
  +  useMerkleSnapshot,
  +  useMinter,
  +  usePollCreator,
  +  useRoundsManager,
  +  useServiceRegistry,
  +  useTicketBroker,
  +} from '@livepeer/react/contracts';
  ```

### Patch Changes

- Updated dependencies [[`ea9d083`](https://github.com/livepeer/livepeer.js/commit/ea9d083869acf571af4cdc22a97b540f5c440f11), [`55a9b81`](https://github.com/livepeer/livepeer.js/commit/55a9b81ebdd524a42da0fb7679ca75d11c4c91a9), [`ea9d083`](https://github.com/livepeer/livepeer.js/commit/ea9d083869acf571af4cdc22a97b540f5c440f11)]:
  - livepeer@1.0.0

## 0.6.1

### Patch Changes

- [#68](https://github.com/livepeer/livepeer.js/pull/68) [`8f5e4a3`](https://github.com/livepeer/livepeer.js/commit/8f5e4a3118458b0b01b667ab81f98382eae7dc5d) Thanks [@victorges](https://github.com/victorges)! - Allow configuring base URL of Livepeer Studio provider

  You can now configure more parameters of the the Livepeer Studio provider,
  including specifically the `baseUrl` for the API calls.

  ```ts
  const livepeer = createReactClient({
    provider: studioProvider({
      baseUrl: 'https://studio.my-domain.com/root/api',
      apiKey: '123-abcd',
    }),
  });
  ```

## 0.6.0

### Minor Changes

- [#47](https://github.com/livepeer/livepeer.js/pull/47) [`461eb4e`](https://github.com/livepeer/livepeer.js/commit/461eb4ebc8c4368aa1cc0b5f6c5f5f0b6bf4187e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor**: modified exports in `@livepeer/react` to re-export from `livepeer` and `livepeer/providers/studio` for a better devex. This makes the `livepeer` dependency unnecessary for React projects.

  ```diff
  +export {
  +  allChainId,
  +  arbitrumOneAddress,
  +  arbitrumRinkebyAddress,
  +  ArbRetryableTxABI,
  +  BondingManagerABI,
  +  Client,
  +  ControllerABI,
  +  createStorage,
  +  defaultStudioApiKey,
  +  defaultTranscodingProfiles,
  +  InboxABI,
  +  L1BondingManagerABI,
  +  L1MigratorABI,
  +  L2LPTGatewayABI,
  +  L2MigratorABI,
  +  LivepeerTokenABI,
  +  LivepeerTokenFaucetABI,
  +  mainnetAddress,
  +  mainnetChainId,
  +  MerkleSnapshotABI,
  +  MinterABI,
  +  NodeInterfaceABI,
  +  noopStorage,
  +  PollABI,
  +  PollCreatorABI,
  +  rinkebyAddress,
  +  RoundsManagerABI,
  +  ServiceRegistryABI,
  +  studio,
  +  testnetChainId,
  +  TicketBrokerABI,
  +} from 'livepeer';
  +export type {
  +  Address,
  +  ArbRetryableTx,
  +  Asset,
  +  BondingManager,
  +  ClientConfig,
  +  Controller,
  +  CreateAssetArgs,
  +  CreateStreamArgs,
  +  GetAssetArgs,
  +  GetLivepeerProviderResult,
  +  GetPlaybackInfoArgs,
  +  GetStreamArgs,
  +  GetStreamSessionArgs,
  +  GetStreamSessionsArgs,
  +  Hash,
  +  HlsVideoConfig,
  +  HttpError,
  +  Inbox,
  +  IncorrectChainIdError,
  +  L1Address,
  +  L1BondingManager,
  +  L1LivepeerChain,
  +  L1LivepeerChainId,
  +  L1Migrator,
  +  L2Address,
  +  L2LivepeerChain,
  +  L2LivepeerChainId,
  +  L2LPTGateway,
  +  L2Migrator,
  +  LivepeerAddress,
  +  LivepeerChain,
  +  LivepeerChainId,
  +  LivepeerProvider,
  +  LivepeerProviderConfig,
  +  LivepeerProviderName,
  +  LivepeerToken,
  +  LivepeerTokenFaucet,
  +  MainnetLivepeerChain,
  +  MainnetLivepeerChainId,
  +  MerkleSnapshot,
  +  Metrics,
  +  Minter,
  +  MultistreamTarget,
  +  MultistreamTargetRef,
  +  NodeInterface,
  +  PlaybackInfo,
  +  PlaybackRecord,
  +  Poll,
  +  PollCreator,
  +  RoundsManager,
  +  ServiceRegistry,
  +  Storage,
  +  Stream,
  +  StreamSession,
  +  TestnetLivepeerChain,
  +  TestnetLivepeerChainId,
  +  TicketBroker,
  +  TranscodingProfile,
  +  UpdateAssetArgs,
  +  UpdateStreamArgs,
  +  WatchLivepeerProviderCallback,
  +} from 'livepeer';
  +export {
  +  studioProvider,
  +  type StudioLivepeerProviderConfig,
  +} from 'livepeer/providers/studio';
   export { createReactClient } from './client';
   export type {
     CreateReactClientConfig,
  +  ReactClient,
   } from './client';
   export { VideoPlayer } from './components';
  ```

## 0.5.0

### Minor Changes

- [#44](https://github.com/livepeer/livepeer.js/pull/44) [`648ddf5`](https://github.com/livepeer/livepeer.js/commit/648ddf528e9bc9250458e0c5f5140aa3f41878f0) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Asset Metrics (`useAssetMetrics`)

  `useAssetMetrics` hook has been added for fetching asset metrics. This hook will update
  when viewership metrics have been reported to the correct reporting URL (this is handled in
  `@livepeer/react`'s `VideoPlayer`).

  ```typescript
  const { data: metrics } = useAssetMetrics({
    assetId: createdAsset?.id,
    refetchInterval: (metrics) => (!metrics ? 30000 : false),
  });

  const viewCount = metrics?.metrics?.[0]?.startViews ?? 0;
  ```

### Patch Changes

- Updated dependencies [[`648ddf5`](https://github.com/livepeer/livepeer.js/commit/648ddf528e9bc9250458e0c5f5140aa3f41878f0), [`416951d`](https://github.com/livepeer/livepeer.js/commit/416951d03c42e7bba1bbfa535a91e5f277130e5f)]:
  - livepeer@0.5.0

## 0.4.0

### Minor Changes

- [#27](https://github.com/livepeer/livepeer.js/pull/27) [`6635d96`](https://github.com/livepeer/livepeer.js/commit/6635d964912654a4056bace416bc315ef5f18e2d) Thanks [@victorges](https://github.com/victorges)! - **Fix:** Improve LivepeerProvider types

  Types are now all documented and extensive for the current version of the Studio
  API which is the base for the LivepeerProvider interface.

  Storage API has also changed slightly, to allow storing an asset in multiple
  different storages in the future. Right now it still only supports IPFS, but the
  interface is now compatible with adding more storages in the future.

  **Feature:** Multistream

  The LivepeerProvider now supports the multistream feature. To use it simply add
  a `multistream` field with the desired configuration when creating or updating a
  `Stream` object.

  ```typescript
  const { mutate: createStream } = useCreateStream();
  createStream({
    name,
    multistream: {
      targets: [
        {
          url: 'rtmp://ingest.example.com/rtmp/myStreamKey',
        },
      ],
    },
  });
  ```

  **Feature:** Upload progress

  Track and show upload progress when creating assets through the `uploadProgress` field in the `useCreateAsset` hook.

  ```typescript
  function App() {
    const createAsset = useCreateAsset();
    return (
      <Button onClick={() => createAsset.mutate({ name, file })}>Create</Button>
      <Text>Upload progress: {100 * createAsset?.uploadProgress ?? 0}%</Text>
    );
  }
  ```

### Patch Changes

- Updated dependencies [[`6635d96`](https://github.com/livepeer/livepeer.js/commit/6635d964912654a4056bace416bc315ef5f18e2d)]:
  - livepeer@0.4.0

## 0.3.0

### Minor Changes

- [#26](https://github.com/livepeer/livepeer.js/pull/26) [`94fd2c8`](https://github.com/livepeer/livepeer.js/commit/94fd2c8c7b2d8d0b37f4ee074ecd23be8296bd35) Thanks [@clacladev](https://github.com/clacladev)! - **Feature:** added a `VideoPlayer` component to provide HLS and LLHLS video streaming.

  See below for the API changes:

  ```diff
  + export { VideoPlayer } from './components';
  ```

  The `VideoPlayer` component uses hls.js under the hood and creates a new `HTMLVideoElement` and adds event handlers for metrics reporting.

  ```typescript
  import { VideoPlayer } from '@livepeer/react';

  const playbackId = 'abcde6mykgkvtxav';

  function App() {
    return <VideoPlayer playbackId={playbackId} />;
  }
  ```

  The `VideoPlayer` requires a `playbackId` or `src` prop to be passed, with the `playbackId` automatically used to fetch the playback URL from the provider.

### Patch Changes

- [#34](https://github.com/livepeer/livepeer.js/pull/34) [`d3aa654`](https://github.com/livepeer/livepeer.js/commit/d3aa654e8f7cd486ebedf481fec398a268fd4597) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated `react-query`, `ethers`, and `wagmi` to latest versions.

  ```diff
     "dependencies": {
  -    "@tanstack/query-sync-storage-persister": "4.0.10",
  -    "@tanstack/react-query": "4.1.3",
  -    "@tanstack/react-query-persist-client": "4.0.10",
  +    "@tanstack/query-sync-storage-persister": "4.2.3",
  +    "@tanstack/react-query": "4.2.3",
  +    "@tanstack/react-query-persist-client": "4.2.1",
       "use-sync-external-store": "^1.2.0"
     },
     "devDependencies": {
  -    "@testing-library/react": "^13.3.0",
  +    "@testing-library/react": "^13.4.0",
       "@testing-library/react-hooks": "^8.0.1",
  -    "@types/react": "^18.0.17",
  +    "@types/react": "^18.0.18",
       "@types/react-dom": "^18.0.6",
       "@types/use-sync-external-store": "^0.0.3",
  -    "ethers": "^5.6.9",
  +    "ethers": "^5.7.0",
       "livepeer": "^0.2.2",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
  -    "wagmi": "^0.6.3"
  +    "wagmi": "^0.6.4"
     },
     "keywords": [
       "dapps",
  ```

- Updated dependencies [[`d3aa654`](https://github.com/livepeer/livepeer.js/commit/d3aa654e8f7cd486ebedf481fec398a268fd4597), [`94fd2c8`](https://github.com/livepeer/livepeer.js/commit/94fd2c8c7b2d8d0b37f4ee074ecd23be8296bd35)]:
  - livepeer@0.3.0

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
  - const lpmsProvider = useLPMSProvider<TLPMSProvider>();
  + const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();
  ```

  ```diff
  - import { StudioLPMSProvider, studioProvider } from 'livepeer/providers/studio';
  + import {
  +   StudioLivepeerProvider,
  +   studioProvider,
  + } from 'livepeer/providers/studio';
  ```

- Updated dependencies [[`1c38dcd`](https://github.com/livepeer/livepeer.js/commit/1c38dcde2a7abce7a7785bcd6880ab6f71f0e0e4)]:
  - livepeer@0.2.1

## 0.2.0

### Minor Changes

- [#1](https://github.com/livepeer/livepeer.js/pull/1) [`6a8c1f5`](https://github.com/livepeer/livepeer.js/commit/6a8c1f59065533bbdb10bd73abca91e519370393) Thanks [@0xcadams](https://github.com/0xcadams)! - The `@livepeer/react` package is now comprised of three main groups:

  - **client:** the React-specific LPMS provider wrapped with `react-query` for query caching/persistence to storage
  - **context:** React Context for providing the client to React hooks
  - **hooks:** functions to write/read from Livepeer Media Server (LPMS) providers and the Livepeer protocol smart contracts

  ### Client

  ```diff
  + import { createReactClient } from '@livepeer/react';
  + import type { CreateReactClientConfig } from '@livepeer/react';
  ```

  ### Context

  ```diff
  + import { Context, LivepeerConfig, useClient } from '@livepeer/react';
  + import type { LivepeerConfigProps } from '@livepeer/react';
  ```

  ### Hooks

  ```diff
  + import {
  +   useAsset,
  +   useBondingManager,
  +   useController,
  +   useCreateAsset,
  +   useCreateStream,
  +   useL1Migrator,
  +   useL2Migrator,
  +   useLivepeerToken,
  +   useLivepeerTokenFaucet,
  +   useLPMSProvider,
  +   useMerkleSnapshot,
  +   useMinter,
  +   usePollCreator,
  +   useRoundsManager,
  +   useServiceRegistry,
  +   useStream,
  +   useStreamSession,
  +   useStreamSessions,
  +   useTicketBroker,
  +   useUpdateAsset,
  +   useUpdateStream,
  + } from '@livepeer/react';
  ```

### Patch Changes

- Updated dependencies [[`ebd1587`](https://github.com/livepeer/livepeer.js/commit/ebd15872cf7ac48a092ad88ea3a470a1c788e223)]:
  - livepeer@0.2.0
