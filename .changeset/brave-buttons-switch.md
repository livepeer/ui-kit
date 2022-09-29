---
'@livepeer/react': major
---

**Feature:** added a new `<Player />` component and deprecated the previous `<VideoPlayer />`. Also added polyfills using `core-js` and `browserslist` to support major global browsers.

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
