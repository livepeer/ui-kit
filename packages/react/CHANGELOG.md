# @livepeer/react

## 2.8.6

### Patch Changes

- [#379](https://github.com/livepeer/livepeer.js/pull/379) [`b29684d`](https://github.com/livepeer/livepeer.js/commit/b29684dfcf3259af2637a0d98059ba2a774084b4) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added custom components to render in place of the default error components, for when a stream is offline: `streamOfflineErrorComponent`, when an access control error occurs (like an invalid JWT is passed): `accessControlErrorComponent`, and when playback fails another unknown error: `playbackFailedErrorComponent`.

  Also added a callback for when these errors occur: `onPlaybackError`. This can be used like:

  ```tsx
  onPlaybackError={(e) => {
    if (e === null) {
      doSomethingWithErrorResolved();
    } else if (e?.type === 'offline') {
      doSomethingWithOfflineError();
    }
  }}
  ```

- Updated dependencies [[`b29684d`](https://github.com/livepeer/livepeer.js/commit/b29684dfcf3259af2637a0d98059ba2a774084b4)]:
  - @livepeer/core-react@1.8.6
  - livepeer@2.8.6

## 2.8.5

### Patch Changes

- [`17f84fd`](https://github.com/livepeer/livepeer.js/commit/17f84fd5dc9091555e240f45c0c54ae90b9e5a3d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** bumping version due to intermittent release error.

- Updated dependencies [[`17f84fd`](https://github.com/livepeer/livepeer.js/commit/17f84fd5dc9091555e240f45c0c54ae90b9e5a3d)]:
  - @livepeer/core-react@1.8.5
  - livepeer@2.8.5

## 2.8.4

### Patch Changes

- [#376](https://github.com/livepeer/livepeer.js/pull/376) [`3301827`](https://github.com/livepeer/livepeer.js/commit/33018273c81b6a0482ce1cbb9441b7a1f100bf46) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed to have a cleaner fallback for 406 response from WebRTC negotiation.

- Updated dependencies [[`3301827`](https://github.com/livepeer/livepeer.js/commit/33018273c81b6a0482ce1cbb9441b7a1f100bf46)]:
  - @livepeer/core-react@1.8.4
  - livepeer@2.8.4

## 2.8.3

### Patch Changes

- [#374](https://github.com/livepeer/livepeer.js/pull/374) [`5cbf402`](https://github.com/livepeer/livepeer.js/commit/5cbf4021ce3771d52bc69f2667f1431f6238e44d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the fallback when b-frames exist to not show a playback error until HLS has been attempted.

- Updated dependencies [[`5cbf402`](https://github.com/livepeer/livepeer.js/commit/5cbf4021ce3771d52bc69f2667f1431f6238e44d)]:
  - @livepeer/core-react@1.8.3
  - livepeer@2.8.3

## 2.8.2

### Patch Changes

- [`d809f28`](https://github.com/livepeer/livepeer.js/commit/d809f28ea71dd0317ae57973a4f85c5d65ad5d0a) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added changes to strip a non-standard port number from the WebRTC redirect host, if present.

- Updated dependencies [[`d809f28`](https://github.com/livepeer/livepeer.js/commit/d809f28ea71dd0317ae57973a4f85c5d65ad5d0a)]:
  - @livepeer/core-react@1.8.2
  - livepeer@2.8.2

## 2.8.1

### Patch Changes

- [#370](https://github.com/livepeer/livepeer.js/pull/370) [`269d3a3`](https://github.com/livepeer/livepeer.js/commit/269d3a3f37845ea643e3c4f281de62347529b988) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix for TTFF reporting, to measure the difference between the `play` event and the first progress update.

- Updated dependencies [[`269d3a3`](https://github.com/livepeer/livepeer.js/commit/269d3a3f37845ea643e3c4f281de62347529b988)]:
  - @livepeer/core-react@1.8.1
  - livepeer@2.8.1

## 2.8.0

### Minor Changes

- [#364](https://github.com/livepeer/livepeer.js/pull/364) [`37c97e7`](https://github.com/livepeer/livepeer.js/commit/37c97e7cfce433e95cb790965acfd069634e66bd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `lowLatency` option of `force` - this requires WebRTC to be used, if a WebRTC playback source exists (which is only for livestreams). It disables the automatic fallback to HLS.

  Fixed issue when `lowLatency` is `true` where it would immediately fall back to HLS - it should now retry if the stream is offline, and fall back to HLS only when there is an unknown error (this could be a variety of causes - intermittent network issues, browser failure, etc).

  The default `lowLatency` option is now `true` - to opt out of low latency, pass `lowLatency=false` to the Player or the lvpr.tv search params.

### Patch Changes

- Updated dependencies [[`37c97e7`](https://github.com/livepeer/livepeer.js/commit/37c97e7cfce433e95cb790965acfd069634e66bd)]:
  - @livepeer/core-react@1.8.0
  - livepeer@2.8.0

## 2.7.0

### Minor Changes

- [#362](https://github.com/livepeer/livepeer.js/pull/362) [`5c905ce`](https://github.com/livepeer/livepeer.js/commit/5c905cea6d4375a42403fe0eb95b6e522832741b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** update downstream packages and changed the default icon for microphone mute/unmute in `<Broadcast />`.

  Package updates include:

  - `hls.js` upgraded from "^1.4.0" to "^1.4.9", to include a fix from Livepeer's @Thulinma for missing AUD units
  - `core-js` upgraded from "^3.27.2" to "^3.31.1".
  - `cross-fetch` upgraded from "^3.1.5" to "^4.0.0".
  - `tus-js-client` upgraded from "^3.0.1" to "^3.1.0".
  - `zustand` upgraded from "^4.3.2" to "^4.3.9".
  - `@tanstack/query-async-storage-persister`, `@tanstack/query-core`, `@tanstack/react-query`, `@tanstack/react-query-persist-client` all upgraded from "4.22.4" to "4.29.23".

### Patch Changes

- Updated dependencies [[`5c905ce`](https://github.com/livepeer/livepeer.js/commit/5c905cea6d4375a42403fe0eb95b6e522832741b)]:
  - @livepeer/core-react@1.7.0
  - livepeer@2.7.0

## 2.6.1

### Patch Changes

- [`a89e71c`](https://github.com/livepeer/livepeer.js/commit/a89e71c5ed24a0b9ba967f844f5dcf148d004837) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** small styling fix for the video/audio source dropdowns.

- Updated dependencies [[`a89e71c`](https://github.com/livepeer/livepeer.js/commit/a89e71c5ed24a0b9ba967f844f5dcf148d004837)]:
  - livepeer@2.6.1
  - @livepeer/core-react@1.6.1

## 2.6.0

### Minor Changes

- [#358](https://github.com/livepeer/livepeer.js/pull/358) [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added basic `<Broadcast />` component to kick off WebRTC broadcasting testing.

- [#358](https://github.com/livepeer/livepeer.js/pull/358) [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added controls for `<Broadcast />` - `<BroadcastSettings />`, `<AudioToggle />`, and `<VideoToggle />`.

- [#358](https://github.com/livepeer/livepeer.js/pull/358) [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `<Screenshare />` component for Broadcast, which allows a user to share a screen with their WebRTC broadcast.

### Patch Changes

- [#358](https://github.com/livepeer/livepeer.js/pull/358) [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `renderChildrenOutsideContainer` to both Broadcast and Player, which determines whether the children should be rendered outside of the aspect ratio container. This is used for custom controls, so children of the Player/Broadcast can use
  `useMediaController` without any parent elements.

  Also added `onPlaybackStatusUpdate`, which is a callback that is called when the broadcast status updates.
  **This should be used with `playbackStatusSelector` to limit state updates.**

- Updated dependencies [[`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b), [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b), [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b), [`50551ce`](https://github.com/livepeer/livepeer.js/commit/50551cebf04ff64307c95fdce3119ce29dae695b)]:
  - @livepeer/core-react@1.6.0
  - livepeer@2.6.0

## 2.6.0-next.2

### Minor Changes

- [#356](https://github.com/livepeer/livepeer.js/pull/356) [`ac886fb`](https://github.com/livepeer/livepeer.js/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `<Screenshare />` component for Broadcast, which allows a user to share a screen with their WebRTC broadcast.

### Patch Changes

- [#356](https://github.com/livepeer/livepeer.js/pull/356) [`ac886fb`](https://github.com/livepeer/livepeer.js/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `renderChildrenOutsideContainer` to both Broadcast and Player, which determines whether the children should be rendered outside of the aspect ratio container. This is used for custom controls, so children of the Player/Broadcast can use
  `useMediaController` without any parent elements.

  Also added `onPlaybackStatusUpdate`, which is a callback that is called when the broadcast status updates.
  **This should be used with `playbackStatusSelector` to limit state updates.**

- Updated dependencies [[`ac886fb`](https://github.com/livepeer/livepeer.js/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00), [`ac886fb`](https://github.com/livepeer/livepeer.js/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00)]:
  - @livepeer/core-react@1.6.0-next.2
  - livepeer@2.6.0-next.2

## 2.6.0-next.1

### Minor Changes

- [`60b46ad`](https://github.com/livepeer/livepeer.js/commit/60b46add0f0661ab1b95ccf4887ced8f91cb3541) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added controls for `<Broadcast />` - `<BroadcastSettings />`, `<AudioToggle />`, and `<VideoToggle />`.

### Patch Changes

- Updated dependencies [[`60b46ad`](https://github.com/livepeer/livepeer.js/commit/60b46add0f0661ab1b95ccf4887ced8f91cb3541)]:
  - @livepeer/core-react@1.6.0-next.1
  - livepeer@2.6.0-next.1

## 2.6.0-next.0

### Minor Changes

- [#349](https://github.com/livepeer/livepeer.js/pull/349) [`82429d8`](https://github.com/livepeer/livepeer.js/commit/82429d8bd6dbc92d5f7136f445ca408660533d94) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added basic `<Broadcast />` component to kick off WebRTC broadcasting testing.

### Patch Changes

- Updated dependencies [[`82429d8`](https://github.com/livepeer/livepeer.js/commit/82429d8bd6dbc92d5f7136f445ca408660533d94)]:
  - @livepeer/core-react@1.6.0-next.0
  - livepeer@2.6.0-next.0

## 2.5.8

### Patch Changes

- [`4811b3e`](https://github.com/livepeer/livepeer.js/commit/4811b3e42aeb4d42858d2e81b4af127175a722e0) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** thanks @martincik - added `assetId` to the asset upload progress.

- [`7dcda99`](https://github.com/livepeer/livepeer.js/commit/7dcda99453cb204b76f93f5b881c89e1af0cc79d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bug with `navigator.mediaDevices.getUserMedia` throwing an undefined error in a secure context.

- Updated dependencies [[`4811b3e`](https://github.com/livepeer/livepeer.js/commit/4811b3e42aeb4d42858d2e81b4af127175a722e0), [`7dcda99`](https://github.com/livepeer/livepeer.js/commit/7dcda99453cb204b76f93f5b881c89e1af0cc79d)]:
  - livepeer@2.5.8
  - @livepeer/core-react@1.5.8

## 2.5.7

### Patch Changes

- [`9811490`](https://github.com/livepeer/livepeer.js/commit/981149007660ab63d7d09d2d30e9f12aa32c0dfa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** hotfix to improve handling of player version.

- Updated dependencies [[`9811490`](https://github.com/livepeer/livepeer.js/commit/981149007660ab63d7d09d2d30e9f12aa32c0dfa)]:
  - @livepeer/core-react@1.5.7
  - livepeer@2.5.7

## 2.5.6

### Patch Changes

- [#345](https://github.com/livepeer/livepeer.js/pull/345) [`af16f6d`](https://github.com/livepeer/livepeer.js/commit/af16f6dda2360f0734a224fce8ef6326a7e2e513) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** added version identifiers to the playback websocket to help narrow issues related to specific livepeer.js releases.

- Updated dependencies [[`af16f6d`](https://github.com/livepeer/livepeer.js/commit/af16f6dda2360f0734a224fce8ef6326a7e2e513)]:
  - livepeer@2.5.6
  - @livepeer/core-react@1.5.6

## 2.5.5

### Patch Changes

- [#342](https://github.com/livepeer/livepeer.js/pull/342) [`e36b570`](https://github.com/livepeer/livepeer.js/commit/e36b57025246682d1396226fadf665cf12afed86) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed [Safari not emitting `canplay` event](https://github.com/video-dev/hls.js/issues/1686) with autoplay disabled, and replaced this event with `loadedmetadata` to know when the video is ready for playback.

- Updated dependencies [[`e36b570`](https://github.com/livepeer/livepeer.js/commit/e36b57025246682d1396226fadf665cf12afed86)]:
  - livepeer@2.5.5
  - @livepeer/core-react@1.5.5

## 2.5.4

### Patch Changes

- [#340](https://github.com/livepeer/livepeer.js/pull/340) [`99321fb`](https://github.com/livepeer/livepeer.js/commit/99321fb44e130c89fa6e2a0f24082d8a88df9bf7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed WebRTC playback on Safari and removed redundant `HEAD` request in SDP negotiation.

- Updated dependencies [[`99321fb`](https://github.com/livepeer/livepeer.js/commit/99321fb44e130c89fa6e2a0f24082d8a88df9bf7)]:
  - livepeer@2.5.4
  - @livepeer/core-react@1.5.4

## 2.5.3

### Patch Changes

- [#338](https://github.com/livepeer/livepeer.js/pull/338) [`8efce52`](https://github.com/livepeer/livepeer.js/commit/8efce520a6c5f1c240356360671a434088cab7dd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `creatorId` to useCreateStream, useUpdateStream, and useUpdateAsset.

- Updated dependencies [[`8efce52`](https://github.com/livepeer/livepeer.js/commit/8efce520a6c5f1c240356360671a434088cab7dd)]:
  - @livepeer/core-react@1.5.3
  - livepeer@2.5.3

## 2.5.2

### Patch Changes

- [#336](https://github.com/livepeer/livepeer.js/pull/336) [`effc06b`](https://github.com/livepeer/livepeer.js/commit/effc06bd2c578ca1a4688108062badd9f6a9c802) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed TTFF bug with the Player reporting an inaccurate TTFF when `priority` was used with a Player which is below the fold. This was happening on the lvpr.tv player, since it is always set to `priority` even though the Player can be below the fold.

- Updated dependencies [[`effc06b`](https://github.com/livepeer/livepeer.js/commit/effc06bd2c578ca1a4688108062badd9f6a9c802)]:
  - @livepeer/core-react@1.5.2
  - livepeer@2.5.2

## 2.5.1

### Patch Changes

- [#334](https://github.com/livepeer/livepeer.js/pull/334) [`8cd5537`](https://github.com/livepeer/livepeer.js/commit/8cd5537fd19e585cb69c9c1f7fb775a76fae9f25) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added a prop, `lowLatency`, to the Player, to allow for opting-in to low latency WebRTC.

- Updated dependencies [[`8cd5537`](https://github.com/livepeer/livepeer.js/commit/8cd5537fd19e585cb69c9c1f7fb775a76fae9f25)]:
  - livepeer@2.5.1
  - @livepeer/core-react@1.5.1

## 2.5.0

### Minor Changes

- [#314](https://github.com/livepeer/livepeer.js/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added WebRTC playback for the web Player, which uses the new endpoint from the Studio provider to play back WebRTC livestreams, if they are available. If these do not succeed in playing back, the Player will automatically fall back to HLS playback. Also, if the stream contains "bframes" (which are common for users streaming with OBS or other streaming providers), the Player will automatically fall back.

### Patch Changes

- [#318](https://github.com/livepeer/livepeer.js/pull/318) [`0b79b4d`](https://github.com/livepeer/livepeer.js/commit/0b79b4d812d3c783ce15122b522279d8ffb9396f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default WebRTC `videoTrackSelector` to be `0,1`, to select the source video/audio for the lowest latency.

- [#332](https://github.com/livepeer/livepeer.js/pull/332) [`7924cb5`](https://github.com/livepeer/livepeer.js/commit/7924cb5276697386a131046cffe1552347ce27bb) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed default track selector to `first` and loosened video track selector type defs to allow any string.

- [#320](https://github.com/livepeer/livepeer.js/pull/320) [`c49706d`](https://github.com/livepeer/livepeer.js/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed error reporting for metrics websocket with MP4 playback.

- [#329](https://github.com/livepeer/livepeer.js/pull/329) [`be5a1cc`](https://github.com/livepeer/livepeer.js/commit/be5a1cc701065150f35271bff1259dd3dbe06692) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bugs on iOS - use native playback for HLS (instead of HLS.js) and fixed single touch not seeking on Progress.

- [#324](https://github.com/livepeer/livepeer.js/pull/324) [`4c6e1c7`](https://github.com/livepeer/livepeer.js/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolved continuous restart on playback errors and reworked player to only create a single websocket across playbacks.

- [#330](https://github.com/livepeer/livepeer.js/pull/330) [`24111d4`](https://github.com/livepeer/livepeer.js/commit/24111d4902058dbcec6ef3d2e73e396e7ffe8604) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** enable prioritization of WebRTC playback over HLS.

- [#333](https://github.com/livepeer/livepeer.js/pull/333) [`ad1781c`](https://github.com/livepeer/livepeer.js/commit/ad1781c42eab5a6eb41564bea3f8c3ab287cca1e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** removed the video track selector due to an upstream bug, and added configurable timeout for SDP negotiation.

- [#325](https://github.com/livepeer/livepeer.js/pull/325) [`d2c76a6`](https://github.com/livepeer/livepeer.js/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added debouncing to the error handler to increment the source index with exponential backoff, to prevent any fast reloads.

- [#327](https://github.com/livepeer/livepeer.js/pull/327) [`bbb2727`](https://github.com/livepeer/livepeer.js/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolve tus upload issue with large uploads (>1GB) going over nginx limit.

- [#314](https://github.com/livepeer/livepeer.js/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `webrtcConfig` to the Player to allow for customization of playback from WebRTC. This currently only supports selecting the video track, but will be expanded further in future releases.

  ```tsx
  export type WebRTCVideoConfig = {
    /**
     * The configuration for the video track selector in MistServer.
     *
     * @default maxbps
     * @link https://mistserver.org/guides/MistServer_Manual_3.0.pdf
     */
    videoTrackSelector?:
      | 'highbps'
      | 'maxbps'
      | 'bestbps'
      | 'lowbps'
      | 'minbps'
      | 'worstbps';
  };
  ```

- [#322](https://github.com/livepeer/livepeer.js/pull/322) [`e15a399`](https://github.com/livepeer/livepeer.js/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed issue with release not using the latest changes to MP4 restart.

- Updated dependencies [[`0b79b4d`](https://github.com/livepeer/livepeer.js/commit/0b79b4d812d3c783ce15122b522279d8ffb9396f), [`7924cb5`](https://github.com/livepeer/livepeer.js/commit/7924cb5276697386a131046cffe1552347ce27bb), [`c49706d`](https://github.com/livepeer/livepeer.js/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd), [`be5a1cc`](https://github.com/livepeer/livepeer.js/commit/be5a1cc701065150f35271bff1259dd3dbe06692), [`4c6e1c7`](https://github.com/livepeer/livepeer.js/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213), [`24111d4`](https://github.com/livepeer/livepeer.js/commit/24111d4902058dbcec6ef3d2e73e396e7ffe8604), [`ad1781c`](https://github.com/livepeer/livepeer.js/commit/ad1781c42eab5a6eb41564bea3f8c3ab287cca1e), [`d2c76a6`](https://github.com/livepeer/livepeer.js/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c), [`bbb2727`](https://github.com/livepeer/livepeer.js/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e), [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377), [`e15a399`](https://github.com/livepeer/livepeer.js/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad), [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377)]:
  - livepeer@2.5.0
  - @livepeer/core-react@1.5.0

## 2.5.0-next.5

### Patch Changes

- [#329](https://github.com/livepeer/livepeer.js/pull/329) [`be5a1cc`](https://github.com/livepeer/livepeer.js/commit/be5a1cc701065150f35271bff1259dd3dbe06692) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bugs on iOS - use native playback for HLS (instead of HLS.js) and fixed single touch not seeking on Progress.

- [#327](https://github.com/livepeer/livepeer.js/pull/327) [`bbb2727`](https://github.com/livepeer/livepeer.js/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolve tus upload issue with large uploads (>1GB) going over nginx limit.

- Updated dependencies [[`be5a1cc`](https://github.com/livepeer/livepeer.js/commit/be5a1cc701065150f35271bff1259dd3dbe06692), [`bbb2727`](https://github.com/livepeer/livepeer.js/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e)]:
  - livepeer@2.5.0-next.5
  - @livepeer/core-react@1.5.0-next.4

## 2.5.0-next.4

### Patch Changes

- [#325](https://github.com/livepeer/livepeer.js/pull/325) [`d2c76a6`](https://github.com/livepeer/livepeer.js/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added debouncing to the error handler to increment the source index with exponential backoff, to prevent any fast reloads.

- Updated dependencies [[`d2c76a6`](https://github.com/livepeer/livepeer.js/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c)]:
  - @livepeer/core-react@1.5.0-next.3
  - livepeer@2.5.0-next.4

## 2.5.0-next.3

### Patch Changes

- [#324](https://github.com/livepeer/livepeer.js/pull/324) [`4c6e1c7`](https://github.com/livepeer/livepeer.js/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolved continuous restart on playback errors and reworked player to only create a single websocket across playbacks.

- [#322](https://github.com/livepeer/livepeer.js/pull/322) [`e15a399`](https://github.com/livepeer/livepeer.js/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed issue with release not using the latest changes to MP4 restart.

- Updated dependencies [[`4c6e1c7`](https://github.com/livepeer/livepeer.js/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213), [`e15a399`](https://github.com/livepeer/livepeer.js/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad)]:
  - @livepeer/core-react@1.5.0-next.2
  - livepeer@2.5.0-next.3

## 2.5.0-next.2

### Patch Changes

- [#320](https://github.com/livepeer/livepeer.js/pull/320) [`c49706d`](https://github.com/livepeer/livepeer.js/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed error reporting for metrics websocket with MP4 playback.

- Updated dependencies [[`c49706d`](https://github.com/livepeer/livepeer.js/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd)]:
  - @livepeer/core-react@1.5.0-next.1
  - livepeer@2.5.0-next.2

## 2.5.0-next.1

### Patch Changes

- [#318](https://github.com/livepeer/livepeer.js/pull/318) [`0b79b4d`](https://github.com/livepeer/livepeer.js/commit/0b79b4d812d3c783ce15122b522279d8ffb9396f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default WebRTC `videoTrackSelector` to be `0,1`, to select the source video/audio for the lowest latency.

- Updated dependencies [[`0b79b4d`](https://github.com/livepeer/livepeer.js/commit/0b79b4d812d3c783ce15122b522279d8ffb9396f)]:
  - livepeer@2.5.0-next.1

## 2.5.0-next.0

### Minor Changes

- [#314](https://github.com/livepeer/livepeer.js/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added WebRTC playback for the web Player, which uses the new endpoint from the Studio provider to play back WebRTC livestreams, if they are available. If these do not succeed in playing back, the Player will automatically fall back to HLS playback. Also, if the stream contains "bframes" (which are common for users streaming with OBS or other streaming providers), the Player will automatically fall back.

### Patch Changes

- [#314](https://github.com/livepeer/livepeer.js/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `webrtcConfig` to the Player to allow for customization of playback from WebRTC. This currently only supports selecting the video track, but will be expanded further in future releases.

  ```tsx
  export type WebRTCVideoConfig = {
    /**
     * The configuration for the video track selector in MistServer.
     *
     * @default maxbps
     * @link https://mistserver.org/guides/MistServer_Manual_3.0.pdf
     */
    videoTrackSelector?:
      | 'highbps'
      | 'maxbps'
      | 'bestbps'
      | 'lowbps'
      | 'minbps'
      | 'worstbps';
  };
  ```

- Updated dependencies [[`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377), [`49c4c99`](https://github.com/livepeer/livepeer.js/commit/49c4c99f9b044afc37072517db8eda1d94b4c377)]:
  - livepeer@2.5.0-next.0
  - @livepeer/core-react@1.5.0-next.0

## 2.4.4

### Patch Changes

- [#315](https://github.com/livepeer/livepeer.js/pull/315) [`f7246ca`](https://github.com/livepeer/livepeer.js/commit/f7246ca6e4d62758f46bf6c282c632ac97ffc654) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added creator ID to create asset, so users can provide either a string (which is an unverified address) or an object with a `type`. We currently only support `unverified` types, which means that passing a verified signature to verify the address is not yet possible.

  ```tsx
  type CreateAssetCreatorId =
    | {
        /**
         * The `type` of the identifier - unverified means that the value is not signed, and is an address
         * that is blindly trusted.
         */
        type: 'unverified';
        /**
         * Developer-managed ID of the user who created the asset.
         */
        value: string;
      }
    | string;
  ```

- Updated dependencies [[`f7246ca`](https://github.com/livepeer/livepeer.js/commit/f7246ca6e4d62758f46bf6c282c632ac97ffc654)]:
  - @livepeer/core-react@1.4.4
  - livepeer@2.4.4

## 2.4.3

### Patch Changes

- [#310](https://github.com/livepeer/livepeer.js/pull/310) [`f840c70`](https://github.com/livepeer/livepeer.js/commit/f840c70f25a4688d66453db778931db029691866) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed blank source URLs on lvpr.tv.

- [`c8050be`](https://github.com/livepeer/livepeer.js/commit/c8050be34e8056abccaae595df6c6d3153e44fef) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:**: added the ability to pass in a `viewerId` to the Player to pass along to the metrics endpoint, for application builders to be able to query viewership by wallet.

- [`c8050be`](https://github.com/livepeer/livepeer.js/commit/c8050be34e8056abccaae595df6c6d3153e44fef) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:**: fix from @Tiagogv to resolve import errors due to the most recent HLS.js release.

- Updated dependencies [[`f840c70`](https://github.com/livepeer/livepeer.js/commit/f840c70f25a4688d66453db778931db029691866), [`c8050be`](https://github.com/livepeer/livepeer.js/commit/c8050be34e8056abccaae595df6c6d3153e44fef)]:
  - @livepeer/core-react@1.4.3
  - livepeer@2.4.3

## 2.4.2

### Patch Changes

- [#306](https://github.com/livepeer/livepeer.js/pull/306) [`07f4a6e`](https://github.com/livepeer/livepeer.js/commit/07f4a6e3e257834611481325cbe7c7617ec9bf43) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed access control error not resetting when livestream starts.

- Updated dependencies [[`07f4a6e`](https://github.com/livepeer/livepeer.js/commit/07f4a6e3e257834611481325cbe7c7617ec9bf43)]:
  - @livepeer/core-react@1.4.2
  - livepeer@2.4.2

## 2.4.1

### Patch Changes

- [#304](https://github.com/livepeer/livepeer.js/pull/304) [`d2522dd`](https://github.com/livepeer/livepeer.js/commit/d2522dd5d9dffce55c1c9d6f18c4db2b1b7eccda) Thanks [@spreadzp](https://github.com/spreadzp)! - **Feature:** added support for base64 video sources - this allows for a video source like `data:video/webm;base64,GkX...AUL3` to be passed into the `src` prop and the Player will handle it properly.

- Updated dependencies [[`d2522dd`](https://github.com/livepeer/livepeer.js/commit/d2522dd5d9dffce55c1c9d6f18c4db2b1b7eccda)]:
  - @livepeer/core-react@1.4.1
  - livepeer@2.4.1

## 2.4.0

### Minor Changes

- [#299](https://github.com/livepeer/livepeer.js/pull/299) [`ec96b12`](https://github.com/livepeer/livepeer.js/commit/ec96b12243b3688ddff9a55db1a03454d0af0e25) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `accessKey` and `onAccessKeyRequest` props to the Player, to support the `webhook` playback policy which allows users to play back streams/assets with webhook authentication. The access key is appended to the query string in the source URL of the video, and this access key is passed along to a user-defined webhook which validates the payload to make sure the user has access to the content.

### Patch Changes

- [#303](https://github.com/livepeer/livepeer.js/pull/303) [`8f65da8`](https://github.com/livepeer/livepeer.js/commit/8f65da8771771629da6c9fa5a55cce0447966d32) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated the metrics to send the `pageUrl` as the `document.referrer` when used in an iFrame context, to be able to attribute metrics to a page which uses an iFrame.

- [#300](https://github.com/livepeer/livepeer.js/pull/300) [`0054108`](https://github.com/livepeer/livepeer.js/commit/00541089419698d391996be36102f2a702ce7825) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added a `tabIndex` prop to allow for customization of the tab index of the container element, as well as consistent class names for the container elements to allow for custom CSS.

- [#302](https://github.com/livepeer/livepeer.js/pull/302) [`4ebec15`](https://github.com/livepeer/livepeer.js/commit/4ebec150d92f64be31fcb78e9db64c8af6a24f79) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added an `onError` callback to the Player to allow users to catch and handle miscellaneous errors which occur in the Player, which are not already handled.

- Updated dependencies [[`ec96b12`](https://github.com/livepeer/livepeer.js/commit/ec96b12243b3688ddff9a55db1a03454d0af0e25), [`8f65da8`](https://github.com/livepeer/livepeer.js/commit/8f65da8771771629da6c9fa5a55cce0447966d32), [`4ebec15`](https://github.com/livepeer/livepeer.js/commit/4ebec150d92f64be31fcb78e9db64c8af6a24f79)]:
  - @livepeer/core-react@1.4.0
  - livepeer@2.4.0

## 2.3.2

### Patch Changes

- [#298](https://github.com/livepeer/livepeer.js/pull/298) [`b79c11b`](https://github.com/livepeer/livepeer.js/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added the ability to autoplay videos without forcing mute. This works only in certain conditions where the site is considered "trusted" and the user has interacted with the site - see [Chrome](https://developer.chrome.com/blog/autoplay/) and [Safari](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/) docs for further details on when this is allowed. We recommend testing on your site to ensure that the media will autoplay under the conditions that you expect the user to engage with your content.

- [#295](https://github.com/livepeer/livepeer.js/pull/295) [`3f653f7`](https://github.com/livepeer/livepeer.js/commit/3f653f716ed03b587389cda330541cb30a5f3b4a) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the user agent string to be sanitized before passing to the metrics websocket.

- [#297](https://github.com/livepeer/livepeer.js/pull/297) [`1d34ea4`](https://github.com/livepeer/livepeer.js/commit/1d34ea483e8b5e2bfb01d009e376055deab4fe24) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added IPFS upload on creation of an asset, so no subsequent calls need to be made to upload to IPFS.

- [#298](https://github.com/livepeer/livepeer.js/pull/298) [`b79c11b`](https://github.com/livepeer/livepeer.js/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default Player volume level to 1.0, from 0.2. To continue with the previous behavior, use `defaultVolume` in the [controls](https://docs.livepeer.org/reference/livepeer-js/Player#controls) prop.

- Updated dependencies [[`b79c11b`](https://github.com/livepeer/livepeer.js/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b), [`3f653f7`](https://github.com/livepeer/livepeer.js/commit/3f653f716ed03b587389cda330541cb30a5f3b4a), [`1d34ea4`](https://github.com/livepeer/livepeer.js/commit/1d34ea483e8b5e2bfb01d009e376055deab4fe24), [`b79c11b`](https://github.com/livepeer/livepeer.js/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b)]:
  - @livepeer/core-react@1.3.2
  - livepeer@2.3.2

## 2.3.1

### Patch Changes

- [#293](https://github.com/livepeer/livepeer.js/pull/293) [`8e28a01`](https://github.com/livepeer/livepeer.js/commit/8e28a016fb77059524b9a21cddf9e06df699a749) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `sourceUrl` reporting to the Player.

- Updated dependencies [[`8e28a01`](https://github.com/livepeer/livepeer.js/commit/8e28a016fb77059524b9a21cddf9e06df699a749)]:
  - livepeer@2.3.1
  - @livepeer/core-react@1.3.1

## 2.3.0

### Minor Changes

- [#289](https://github.com/livepeer/livepeer.js/pull/289) [`20879a4`](https://github.com/livepeer/livepeer.js/commit/20879a4900e277642674f0dada3b7fc78736ea90) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** changed the Player on React and React Native to hide the progress bar when viewing a livestream. Also improved the live stream experience with better HLS.js defaults for lower latency.

### Patch Changes

- [#291](https://github.com/livepeer/livepeer.js/pull/291) [`2c9bb91`](https://github.com/livepeer/livepeer.js/commit/2c9bb91eb9b09a8d113b47368afc3c89ecc2070e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the styling of the stream error image on small displays (<400px).

- [#289](https://github.com/livepeer/livepeer.js/pull/289) [`20879a4`](https://github.com/livepeer/livepeer.js/commit/20879a4900e277642674f0dada3b7fc78736ea90) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed an error where HLS errors would not provide detail and the Player would throw an `object undefined` error.

- Updated dependencies [[`2c9bb91`](https://github.com/livepeer/livepeer.js/commit/2c9bb91eb9b09a8d113b47368afc3c89ecc2070e), [`20879a4`](https://github.com/livepeer/livepeer.js/commit/20879a4900e277642674f0dada3b7fc78736ea90), [`20879a4`](https://github.com/livepeer/livepeer.js/commit/20879a4900e277642674f0dada3b7fc78736ea90)]:
  - @livepeer/core-react@1.3.0
  - livepeer@2.3.0

## 2.2.5

### Patch Changes

- [#286](https://github.com/livepeer/livepeer.js/pull/286) [`cd502da`](https://github.com/livepeer/livepeer.js/commit/cd502da49908d70ceab241a84a4a670b1a54f701) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** renamed the `protocol` field to `sourceType` to align with the backend metrics websocket.

- Updated dependencies [[`cd502da`](https://github.com/livepeer/livepeer.js/commit/cd502da49908d70ceab241a84a4a670b1a54f701)]:
  - @livepeer/core-react@1.2.5
  - livepeer@2.2.3

## 2.2.4

### Patch Changes

- [#279](https://github.com/livepeer/livepeer.js/pull/279) [`1db99c7`](https://github.com/livepeer/livepeer.js/commit/1db99c782fd1f367d303668c18acdca1c10cda5b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** tuned the button APIs to be easier to customize for custom controls.

- [#276](https://github.com/livepeer/livepeer.js/pull/276) [`25c1bb6`](https://github.com/livepeer/livepeer.js/commit/25c1bb6d572a237cc73ff7d3528673f1e703fcfa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix for re-render bug in the Player, which caused a forced re-render on every refresh of a video.

- [`ae23628`](https://github.com/livepeer/livepeer.js/commit/ae23628df28508a3ca8d5e56ee8cc3707dd67859) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed override of storage to not use `localStorage`.

- [#284](https://github.com/livepeer/livepeer.js/pull/284) [`620751e`](https://github.com/livepeer/livepeer.js/commit/620751efbf1108ce207e5b83f67e28f9e7dd263e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added better logs for failure on `create` in Studio provider.

- Updated dependencies [[`1db99c7`](https://github.com/livepeer/livepeer.js/commit/1db99c782fd1f367d303668c18acdca1c10cda5b), [`25c1bb6`](https://github.com/livepeer/livepeer.js/commit/25c1bb6d572a237cc73ff7d3528673f1e703fcfa), [`620751e`](https://github.com/livepeer/livepeer.js/commit/620751efbf1108ce207e5b83f67e28f9e7dd263e)]:
  - @livepeer/core-react@1.2.4
  - livepeer@2.2.2

## 2.2.4-next.1

### Patch Changes

- [#279](https://github.com/livepeer/livepeer.js/pull/279) [`1db99c7`](https://github.com/livepeer/livepeer.js/commit/1db99c782fd1f367d303668c18acdca1c10cda5b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** tuned the button APIs to be easier to customize for custom controls.

- [`ae23628`](https://github.com/livepeer/livepeer.js/commit/ae23628df28508a3ca8d5e56ee8cc3707dd67859) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed override of storage to not use `localStorage`.

- Updated dependencies [[`1db99c7`](https://github.com/livepeer/livepeer.js/commit/1db99c782fd1f367d303668c18acdca1c10cda5b)]:
  - @livepeer/core-react@1.2.4-next.1

## 2.2.4-next.0

### Patch Changes

- [#276](https://github.com/livepeer/livepeer.js/pull/276) [`25c1bb6`](https://github.com/livepeer/livepeer.js/commit/25c1bb6d572a237cc73ff7d3528673f1e703fcfa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix for re-render bug in the Player, which caused a forced re-render on every refresh of a video.

- Updated dependencies [[`25c1bb6`](https://github.com/livepeer/livepeer.js/commit/25c1bb6d572a237cc73ff7d3528673f1e703fcfa)]:
  - @livepeer/core-react@1.2.4-next.0

## 2.2.3

### Patch Changes

- [#274](https://github.com/livepeer/livepeer.js/pull/274) [`aac6a02`](https://github.com/livepeer/livepeer.js/commit/aac6a02653de8361492f4b8c28725b98246159e2) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added further props for the `ViewabilityConfig` for maximum compatibility with existing FlatList implementations.

- Updated dependencies [[`aac6a02`](https://github.com/livepeer/livepeer.js/commit/aac6a02653de8361492f4b8c28725b98246159e2)]:
  - @livepeer/core-react@1.2.3

## 2.2.2

### Patch Changes

- [`99ceff1`](https://github.com/livepeer/livepeer.js/commit/99ceff19bdb22b033ba84944b903c1494dd0eb28) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed sorting of sources to use the width generated from the playback info endpoint.

- Updated dependencies [[`99ceff1`](https://github.com/livepeer/livepeer.js/commit/99ceff19bdb22b033ba84944b903c1494dd0eb28)]:
  - @livepeer/core-react@1.2.2

## 2.2.1

### Patch Changes

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `usePlayerList` to use a React ref to avoid dynamic runtime `onViewableItemsChanged` errors.

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed uploads in React Native environments by removing chunk size for tus.

- [#272](https://github.com/livepeer/livepeer.js/pull/272) [`b11ea90`](https://github.com/livepeer/livepeer.js/commit/b11ea90bb3e488bd6d6661846313849adf389cdf) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `allowCrossOriginCredentials` to the React Player to allow cookies to be sent with playback requests.

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `getIsVolumeChangeSupported` check to not fail for negative volume values.

- Updated dependencies [[`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7), [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7), [`b11ea90`](https://github.com/livepeer/livepeer.js/commit/b11ea90bb3e488bd6d6661846313849adf389cdf), [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7)]:
  - livepeer@2.2.1
  - @livepeer/core-react@1.2.1

## 2.2.0

### Minor Changes

- [#267](https://github.com/livepeer/livepeer.js/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added MP4 rendition prioritization to the React and React Native Player.

  This is for support of MP4 renditions returned from `playbackInfo` from the Studio provider. If an MP4 rendition exists for an Asset, it will be prioritized over HLS, since this has been introduced as a performance improvement over HLS for short-form video.

  The MP4 renditions will be chosen with the following algorithm: the device screen width and multiplied by a static multiplier (currently set to x2.5). This value is then compared to the rendition widths, and the renditions are prioritized based on the distance between these values. This results in a choice of a rendition which is close to the screen size without visual quality issues. For instance, a device with a 1280 pixel width would compute `1280px * 2.5 = 3200px`, and then sort the MP4 renditions by which are closest to this value.

### Patch Changes

- [#267](https://github.com/livepeer/livepeer.js/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `pageUrl`, `protocol`, `preloadTime`, and `autoplay` to metrics to track performance of video load under specific conditions.

- Updated dependencies [[`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c), [`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c)]:
  - @livepeer/core-react@1.2.0
  - livepeer@2.2.0

## 2.1.5

### Patch Changes

- [#265](https://github.com/livepeer/livepeer.js/pull/265) [`318c082`](https://github.com/livepeer/livepeer.js/commit/318c0824a62cffa69c92ba4eb6c45afbb9920958) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** change the metrics reporting port for staging to use 443.

- Updated dependencies [[`318c082`](https://github.com/livepeer/livepeer.js/commit/318c0824a62cffa69c92ba4eb6c45afbb9920958)]:
  - @livepeer/core-react@1.1.5
  - livepeer@2.1.5

## 2.1.4

### Patch Changes

- [#259](https://github.com/livepeer/livepeer.js/pull/259) [`9568500`](https://github.com/livepeer/livepeer.js/commit/95685009dcb4a2d86b2def2325ade9ddd6d13d1b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added Time to First Frame, Autoplay, and User Agent to metrics reporting. Fixed bugs with play time metrics reporting.

- Updated dependencies [[`9568500`](https://github.com/livepeer/livepeer.js/commit/95685009dcb4a2d86b2def2325ade9ddd6d13d1b)]:
  - livepeer@2.1.4
  - @livepeer/core-react@1.1.4

## 2.1.3

### Patch Changes

- [#255](https://github.com/livepeer/livepeer.js/pull/255) [`0e5cbc9`](https://github.com/livepeer/livepeer.js/commit/0e5cbc98116332260178de3aa188db53b9f5f22c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed Node.js issue with `File` not being defined globally.

- Updated dependencies [[`0e5cbc9`](https://github.com/livepeer/livepeer.js/commit/0e5cbc98116332260178de3aa188db53b9f5f22c)]:
  - livepeer@2.1.3
  - @livepeer/core-react@1.1.3

## 2.1.2

### Patch Changes

- [`a8a2c58`](https://github.com/livepeer/livepeer.js/commit/a8a2c582da2eb49ef33fca27587129ce1c1bfaa6) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** downgraded packages due to versioning conflicts and upgraded `zustand`.

- Updated dependencies [[`a8a2c58`](https://github.com/livepeer/livepeer.js/commit/a8a2c582da2eb49ef33fca27587129ce1c1bfaa6)]:
  - @livepeer/core-react@1.1.2
  - livepeer@2.1.2

## 2.1.1

### Patch Changes

- [#248](https://github.com/livepeer/livepeer.js/pull/248) [`5a1c060`](https://github.com/livepeer/livepeer.js/commit/5a1c0606fc3ab1703a74ca02b18acfa93937d684) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed version headers to reference the correct package names.

- [#243](https://github.com/livepeer/livepeer.js/pull/243) [`89de148`](https://github.com/livepeer/livepeer.js/commit/89de148ea4e9037c0375142db89b9ffea46e96d2) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** moved to using HLS.js on Safari (when supported) instead of the native video player.

- [#251](https://github.com/livepeer/livepeer.js/pull/251) [`686fb51`](https://github.com/livepeer/livepeer.js/commit/686fb5178a5746210cc16f1efb77f2c1273f4527) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated dependencies to latest versions.

- Updated dependencies [[`5a1c060`](https://github.com/livepeer/livepeer.js/commit/5a1c0606fc3ab1703a74ca02b18acfa93937d684), [`89de148`](https://github.com/livepeer/livepeer.js/commit/89de148ea4e9037c0375142db89b9ffea46e96d2), [`686fb51`](https://github.com/livepeer/livepeer.js/commit/686fb5178a5746210cc16f1efb77f2c1273f4527)]:
  - @livepeer/core-react@1.1.1
  - livepeer@2.1.1

## 2.1.1-next.0

### Patch Changes

- [#243](https://github.com/livepeer/livepeer.js/pull/243) [`89de148`](https://github.com/livepeer/livepeer.js/commit/89de148ea4e9037c0375142db89b9ffea46e96d2) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** moved to using HLS.js on Safari (when supported) instead of the native video player.

- Updated dependencies [[`89de148`](https://github.com/livepeer/livepeer.js/commit/89de148ea4e9037c0375142db89b9ffea46e96d2)]:
  - @livepeer/core-react@1.1.1-next.0

## 2.1.0

### Minor Changes

- [#240](https://github.com/livepeer/livepeer.js/pull/240) [`c4cb597`](https://github.com/livepeer/livepeer.js/commit/c4cb59762a31c865bb8ada9a4176caa614f6be7a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

### Patch Changes

- Updated dependencies [[`c4cb597`](https://github.com/livepeer/livepeer.js/commit/c4cb59762a31c865bb8ada9a4176caa614f6be7a)]:
  - @livepeer/core-react@1.1.0
  - livepeer@2.1.0

## 2.0.0

### Major Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the default API key in the SDK for Studio with sunset plan of Jan 6th, 2023, to discourage spam use.

### Minor Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** added `@livepeer/core-react` package which includes all cross-environment hooks, utilities, and types. These are exported as `usePlayer`, `useControlsContainer`, etc.

### Patch Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated `@livepeer/core-react` package.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `mediaElementRef` to Player for compatibility with external libraries.

- [`85dc1f7`](https://github.com/livepeer/livepeer.js/commit/85dc1f7faa35ad36c7209b17a081b62ceefba798) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `priority` boolean to not reset when video is not shown on screen.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed dStorage fallback to only use IPFS when `playbackId` does not exist.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default `objectFit` for the Player to be `contain` instead of `cover`.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed IPFS auto-playback with `src`.

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

- [#213](https://github.com/livepeer/livepeer.js/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated dependencies to latest versions.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bug with resize window breaking the progress slider in the Player.

- [`f8ca8fa`](https://github.com/livepeer/livepeer.js/commit/f8ca8faa53b8248cf651a0306a448ff2ce823a7c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** removed the default border radius on mobile and web.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `showUploadingIndicator` for displaying the uploading text when `autoUrlUpload` is enabled, and renamed`shouldShowLoadingSpinner`to`showLoadingSpinner`.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with IPFS auto-playback and mime type checking in browser.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed core-react to use callback refs to ensure that the consuming code gets the updated ref on mount.

- [#223](https://github.com/livepeer/livepeer.js/pull/223) [`451d304`](https://github.com/livepeer/livepeer.js/commit/451d3045b17938ebe3037d371cf949904285f48b) Thanks [@Ahmed-Aghadi](https://github.com/Ahmed-Aghadi)! - **Fix:** added missing `usePlaybackInfo` export to React/React Native.

- Updated dependencies [[`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`85dc1f7`](https://github.com/livepeer/livepeer.js/commit/85dc1f7faa35ad36c7209b17a081b62ceefba798), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807), [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`f8ca8fa`](https://github.com/livepeer/livepeer.js/commit/f8ca8faa53b8248cf651a0306a448ff2ce823a7c), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`451d304`](https://github.com/livepeer/livepeer.js/commit/451d3045b17938ebe3037d371cf949904285f48b)]:
  - @livepeer/core-react@1.0.0
  - livepeer@2.0.0

## 2.0.0-next.18

### Minor Changes

- [#212](https://github.com/livepeer/livepeer.js/pull/212) [`da28e70`](https://github.com/livepeer/livepeer.js/commit/da28e7037a50e4a3ac3711581cc762f516e5f31a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

### Patch Changes

- [#223](https://github.com/livepeer/livepeer.js/pull/223) [`451d304`](https://github.com/livepeer/livepeer.js/commit/451d3045b17938ebe3037d371cf949904285f48b) Thanks [@Ahmed-Aghadi](https://github.com/Ahmed-Aghadi)! - **Fix:** added missing `usePlaybackInfo` export to React/React Native.

- Updated dependencies [[`da28e70`](https://github.com/livepeer/livepeer.js/commit/da28e7037a50e4a3ac3711581cc762f516e5f31a), [`451d304`](https://github.com/livepeer/livepeer.js/commit/451d3045b17938ebe3037d371cf949904285f48b)]:
  - @livepeer/core-react@1.0.0-next.17
  - livepeer@2.0.0-next.8

## 2.0.0-next.17

### Patch Changes

- [`85dc1f7`](https://github.com/livepeer/livepeer.js/commit/85dc1f7faa35ad36c7209b17a081b62ceefba798) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `priority` boolean to not reset when video is not shown on screen.

- Updated dependencies [[`85dc1f7`](https://github.com/livepeer/livepeer.js/commit/85dc1f7faa35ad36c7209b17a081b62ceefba798)]:
  - @livepeer/core-react@1.0.0-next.16

## 2.0.0-next.16

### Patch Changes

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

- Updated dependencies [[`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807), [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807)]:
  - @livepeer/core-react@1.0.0-next.15

## 2.0.0-next.15

### Patch Changes

- [#213](https://github.com/livepeer/livepeer.js/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

- Updated dependencies [[`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b)]:
  - @livepeer/core-react@1.0.0-next.14
  - livepeer@2.0.0-next.7

## 2.0.0-next.14

### Patch Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

- [`f8ca8fa`](https://github.com/livepeer/livepeer.js/commit/f8ca8faa53b8248cf651a0306a448ff2ce823a7c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** removed the default border radius on mobile and web.

- Updated dependencies [[`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52), [`f8ca8fa`](https://github.com/livepeer/livepeer.js/commit/f8ca8faa53b8248cf651a0306a448ff2ce823a7c)]:
  - @livepeer/core-react@1.0.0-next.13
  - livepeer@2.0.0-next.6

## 2.0.0-next.13

### Patch Changes

- [#197](https://github.com/livepeer/livepeer.js/pull/197) [`748ddfa`](https://github.com/livepeer/livepeer.js/commit/748ddfa8ffc458c0a91e536a74a1933e57909745) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default `objectFit` for the Player to be `contain` instead of `cover`.

- Updated dependencies [[`748ddfa`](https://github.com/livepeer/livepeer.js/commit/748ddfa8ffc458c0a91e536a74a1933e57909745)]:
  - @livepeer/core-react@1.0.0-next.12

## 2.0.0-next.12

### Patch Changes

- [#195](https://github.com/livepeer/livepeer.js/pull/195) [`e866579`](https://github.com/livepeer/livepeer.js/commit/e86657964e2dd9d141d7d06023207ae88d5c4169) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

- Updated dependencies [[`e866579`](https://github.com/livepeer/livepeer.js/commit/e86657964e2dd9d141d7d06023207ae88d5c4169)]:
  - @livepeer/core-react@1.0.0-next.11
  - livepeer@2.0.0-next.5

## 2.0.0-next.11

### Patch Changes

- [#193](https://github.com/livepeer/livepeer.js/pull/193) [`fa5d2c6`](https://github.com/livepeer/livepeer.js/commit/fa5d2c62bd1a45ae8a12052973e9ae097ce6b0f2) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `showUploadingIndicator` for displaying the uploading text when `autoUrlUpload` is enabled, and renamed`shouldShowLoadingSpinner`to`showLoadingSpinner`.

- Updated dependencies [[`fa5d2c6`](https://github.com/livepeer/livepeer.js/commit/fa5d2c62bd1a45ae8a12052973e9ae097ce6b0f2)]:
  - @livepeer/core-react@1.0.0-next.10

## 2.0.0-next.10

### Patch Changes

- [`d4b4264`](https://github.com/livepeer/livepeer.js/commit/d4b42644fdbf8d4d50e74798bdc0df6e2ceee9b4) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed IPFS auto-playback with `src`.

- Updated dependencies [[`d4b4264`](https://github.com/livepeer/livepeer.js/commit/d4b42644fdbf8d4d50e74798bdc0df6e2ceee9b4)]:
  - @livepeer/core-react@1.0.0-next.9

## 2.0.0-next.9

### Patch Changes

- [`3cada35`](https://github.com/livepeer/livepeer.js/commit/3cada350006426a006c6722f28623e25a1fda2b4) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed dStorage fallback to only use IPFS when `playbackId` does not exist.

- Updated dependencies [[`3cada35`](https://github.com/livepeer/livepeer.js/commit/3cada350006426a006c6722f28623e25a1fda2b4)]:
  - @livepeer/core-react@1.0.0-next.8

## 2.0.0-next.8

### Patch Changes

- [#189](https://github.com/livepeer/livepeer.js/pull/189) [`0f6bb63`](https://github.com/livepeer/livepeer.js/commit/0f6bb636f96ded681f9d02947f4ff022bab2a7cd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with IPFS auto-playback and mime type checking in browser.

- Updated dependencies [[`0f6bb63`](https://github.com/livepeer/livepeer.js/commit/0f6bb636f96ded681f9d02947f4ff022bab2a7cd)]:
  - @livepeer/core-react@1.0.0-next.7
  - livepeer@2.0.0-next.4

## 2.0.0-next.7

### Patch Changes

- [#187](https://github.com/livepeer/livepeer.js/pull/187) [`44adf29`](https://github.com/livepeer/livepeer.js/commit/44adf2940ae3621038d87f1444b18398a57d399e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

- Updated dependencies [[`44adf29`](https://github.com/livepeer/livepeer.js/commit/44adf2940ae3621038d87f1444b18398a57d399e)]:
  - @livepeer/core-react@1.0.0-next.6
  - livepeer@2.0.0-next.3

## 2.0.0-next.6

### Patch Changes

- [#184](https://github.com/livepeer/livepeer.js/pull/184) [`c3fb3bb`](https://github.com/livepeer/livepeer.js/commit/c3fb3bbf909b5a9864f6d86dc8b4622e2f1f4c55) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bug with resize window breaking the progress slider in the Player.

## 2.0.0-next.5

### Minor Changes

- [#182](https://github.com/livepeer/livepeer.js/pull/182) [`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

- [#182](https://github.com/livepeer/livepeer.js/pull/182) [`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).

### Patch Changes

- Updated dependencies [[`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912), [`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912)]:
  - @livepeer/core-react@1.0.0-next.5
  - livepeer@2.0.0-next.2

## 2.0.0-next.4

### Patch Changes

- [`e656367`](https://github.com/livepeer/livepeer.js/commit/e6563674369549a5335a511009165698748bc67e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed core-react to use callback refs to ensure that the consuming code gets the updated ref on mount.

- Updated dependencies [[`e656367`](https://github.com/livepeer/livepeer.js/commit/e6563674369549a5335a511009165698748bc67e)]:
  - @livepeer/core-react@1.0.0-next.4

## 2.0.0-next.3

### Patch Changes

- [#179](https://github.com/livepeer/livepeer.js/pull/179) [`a04136e`](https://github.com/livepeer/livepeer.js/commit/a04136efd4d315e6122b6a307c21ee400564cbbb) Thanks [@github-actions](https://github.com/apps/github-actions)! - **Chore:** updated `@livepeer/core-react` package.

- Updated dependencies [[`a04136e`](https://github.com/livepeer/livepeer.js/commit/a04136efd4d315e6122b6a307c21ee400564cbbb)]:
  - @livepeer/core-react@1.0.0-next.3

## 2.0.0-next.2

### Patch Changes

- [#177](https://github.com/livepeer/livepeer.js/pull/177) [`8b0d1b3`](https://github.com/livepeer/livepeer.js/commit/8b0d1b33ff8e769ed6dd57d02b27bad475b4340a) Thanks [@github-actions](https://github.com/apps/github-actions)! - **Fix:** added `mediaElementRef` to Player for compatibility with external libraries.

## 2.0.0-next.1

### Major Changes

- [#172](https://github.com/livepeer/livepeer.js/pull/172) [`f2b5ed2`](https://github.com/livepeer/livepeer.js/commit/f2b5ed28bdbaf327609a845745637da0e010696c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the default API key in the SDK for Studio with sunset plan of Jan 6th, 2023, to discourage spam use.

### Patch Changes

- Updated dependencies [[`f2b5ed2`](https://github.com/livepeer/livepeer.js/commit/f2b5ed28bdbaf327609a845745637da0e010696c)]:
  - livepeer@2.0.0-next.1
  - @livepeer/core-react@1.0.0-next.1

## 1.6.0-next.0

### Minor Changes

- [`cc4f4e8`](https://github.com/livepeer/livepeer.js/commit/cc4f4e87d48cbefaabcfa6dd867544a43584657f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** added `@livepeer/core-react` package which includes all cross-environment hooks, utilities, and types. These are exported as `usePlayer`, `useControlsContainer`, etc.

### Patch Changes

- [`cc4f4e8`](https://github.com/livepeer/livepeer.js/commit/cc4f4e87d48cbefaabcfa6dd867544a43584657f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated dependencies to latest versions.

- Updated dependencies [[`cc4f4e8`](https://github.com/livepeer/livepeer.js/commit/cc4f4e87d48cbefaabcfa6dd867544a43584657f), [`cc4f4e8`](https://github.com/livepeer/livepeer.js/commit/cc4f4e87d48cbefaabcfa6dd867544a43584657f), [`cc4f4e8`](https://github.com/livepeer/livepeer.js/commit/cc4f4e87d48cbefaabcfa6dd867544a43584657f)]:
  - livepeer@1.5.0-next.0
  - @livepeer/core-react@0.1.0-next.0

## 1.5.6

### Patch Changes

- [#164](https://github.com/livepeer/livepeer.js/pull/164) [`25858bc`](https://github.com/livepeer/livepeer.js/commit/25858bce3d65777f3d4b9a915eae0f80b76974fa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated to use `w3s.link` as the default IPFS gateway for immediate playback from IPFS in the Player.

## 1.5.5

### Patch Changes

- [#161](https://github.com/livepeer/livepeer.js/pull/161) [`bf67833`](https://github.com/livepeer/livepeer.js/commit/bf678330a3273064617104a08332f2a1e74250e6) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added fallback to play directly from IPFS in the Player.

  ```tsx
  export type PlayerProps = {
    ...
    autoUrlUpload?:
      | boolean
      | { fallback: true; ipfsGateway?: string; arweaveGateway?: string };
    ...
  };
  ```

## 1.5.4

### Patch Changes

- [#158](https://github.com/livepeer/livepeer.js/pull/158) [`d89613e`](https://github.com/livepeer/livepeer.js/commit/d89613e34162247c4587c88f84e2410df97394ef) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed a bug with the same file not being able to be uploaded twice by the same client - reverted changes to the Tus fingerprint.

- Updated dependencies [[`d89613e`](https://github.com/livepeer/livepeer.js/commit/d89613e34162247c4587c88f84e2410df97394ef)]:
  - livepeer@1.4.3

## 1.5.3

### Patch Changes

- [#154](https://github.com/livepeer/livepeer.js/pull/154) [`86a30f0`](https://github.com/livepeer/livepeer.js/commit/86a30f0dd20526fff2c3aa5a4ddc754569d8f5e0) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the `autoUrlUpload` in the Player to fix multiple requests when attempting to automatically upload an asset.

## 1.5.2

### Patch Changes

- [`3487d98`](https://github.com/livepeer/livepeer.js/commit/3487d9820e86aa970db744548bb067c27c51cbf3) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed a bug with network timeout not triggering a `<Player />` reload when using hls.js.

- Updated dependencies [[`3487d98`](https://github.com/livepeer/livepeer.js/commit/3487d9820e86aa970db744548bb067c27c51cbf3)]:
  - livepeer@1.4.2

## 1.5.1

### Patch Changes

- [#144](https://github.com/livepeer/livepeer.js/pull/144) [`34af303`](https://github.com/livepeer/livepeer.js/commit/34af303b552a2334408abc2db3dda0a8debe4274) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Fix:** rounded the duration to 1:00 instead of 0:60.

  When a video is 59.9 seconds long, the duration is rounded to 1:00 instead of saying 00:60.

- [#145](https://github.com/livepeer/livepeer.js/pull/145) [`3620666`](https://github.com/livepeer/livepeer.js/commit/36206660ab8825480414e4fb13409e1c22cc68f2) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Fix:** fixed the behaviour that caused the video to pause when a user touched it on a mobile device without the controls being shown. The video now pauses on the second touch (after the controls are shown).

- [`825b25c`](https://github.com/livepeer/livepeer.js/commit/825b25c0c0d539b1596f932757f0184327fcb5c8) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed control state to use storage from the client.

- Updated dependencies [[`3620666`](https://github.com/livepeer/livepeer.js/commit/36206660ab8825480414e4fb13409e1c22cc68f2), [`825b25c`](https://github.com/livepeer/livepeer.js/commit/825b25c0c0d539b1596f932757f0184327fcb5c8)]:
  - livepeer@1.4.1

## 1.5.0

### Minor Changes

- [#140](https://github.com/livepeer/livepeer.js/pull/140) [`2f1b286`](https://github.com/livepeer/livepeer.js/commit/2f1b286f65a2eda0b0ff0c2142ec8744d23a4dab) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** reworked mutations in `@livepeer/react` to use variables passed into the hook, for better a typing experience. See docs for examples.

- [#102](https://github.com/livepeer/livepeer.js/pull/102) [`0ea4ec7`](https://github.com/livepeer/livepeer.js/commit/0ea4ec7fc7f2fa2e1504c7e976cbcf55d335981d) Thanks [@suhailkakar](https://github.com/suhailkakar)! - **Feature:** Add support for multiple files at once using useCreateAsset.

  You can upload multiple assets at once by passing an array of files to the `mutate` function. In return you will get an array of uploaded assets.

- [#140](https://github.com/livepeer/livepeer.js/pull/140) [`2f1b286`](https://github.com/livepeer/livepeer.js/commit/2f1b286f65a2eda0b0ff0c2142ec8744d23a4dab) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added auto-polling in `createAsset` to monitor the status of assets with a callback, instead of having to poll the API manually.

### Patch Changes

- [#141](https://github.com/livepeer/livepeer.js/pull/141) [`dc79b20`](https://github.com/livepeer/livepeer.js/commit/dc79b20f9f95a5082934be24b0a56ea590f2d086) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the prerendering query when `undefined` is return in `getStaticProps`.

- Updated dependencies [[`0ea4ec7`](https://github.com/livepeer/livepeer.js/commit/0ea4ec7fc7f2fa2e1504c7e976cbcf55d335981d), [`dc79b20`](https://github.com/livepeer/livepeer.js/commit/dc79b20f9f95a5082934be24b0a56ea590f2d086)]:
  - livepeer@1.4.0

## 1.4.0

### Minor Changes

- [#93](https://github.com/livepeer/livepeer.js/pull/93) [`f19779f`](https://github.com/livepeer/livepeer.js/commit/f19779f321fdd44b5c6a63b379f5d722e71a46e9) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added JWT handling in Player, with `livepeer/crypto` subpackage with JWT helpers for NodeJS access control on Assets and Streams.

  The Player has a new prop, `jwt`, which takes a base64Url-encoded signed JWT payload and passes it as a query parameter with the stream playlist request. The livepeer provider will evaluate the JWT and determine if it is valid, before returning a response.

  _Note: this currently only works for Streams! Assets will be supported in the future._

  ```diff
  + import { importPKCS8, signAccessJwt, type SignAccessJwtOptions } from 'livepeer';
  ```

  ```tsx
  <Player
    title="Agent 327: Operation Barbershop"
    playbackId="6d7el73r1y12chxr"
    jwt={jwt}
  />
  ```

### Patch Changes

- [#131](https://github.com/livepeer/livepeer.js/pull/131) [`118c262`](https://github.com/livepeer/livepeer.js/commit/118c262d7d1bc4a05d7eadf7f5445598a08320ce) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added handling of paths in IPFS and Arweave URLs for both auto-upload and Player playback.

- Updated dependencies [[`f19779f`](https://github.com/livepeer/livepeer.js/commit/f19779f321fdd44b5c6a63b379f5d722e71a46e9), [`61ce2dc`](https://github.com/livepeer/livepeer.js/commit/61ce2dc733e97216cb5ca3cc3066a489a796f7ca), [`118c262`](https://github.com/livepeer/livepeer.js/commit/118c262d7d1bc4a05d7eadf7f5445598a08320ce)]:
  - livepeer@1.3.0

## 1.3.0

### Minor Changes

- [#123](https://github.com/livepeer/livepeer.js/pull/123) [`b5990cf`](https://github.com/livepeer/livepeer.js/commit/b5990cf0b2f8e366c60462083966eb335555998f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added prefetch to all React hooks.

  The new functions include: `prefetchAsset`, `prefetchAssetMetrics`, `prefetchPlaybackInfo`, `prefetchStream`, `prefetchStreamSession`, `prefetchStreamSessions`, which provide prefetching using React Query. Also added `prefetchPlayer`, which wraps `prefetchPlaybackInfo` to make it easier to use the prefetch hooks with the Player.

### Patch Changes

- [#122](https://github.com/livepeer/livepeer.js/pull/122) [`f5b370c`](https://github.com/livepeer/livepeer.js/commit/f5b370cfb94f57c1075dbd9f211b6881bb0da017) Thanks [@suhailkakar](https://github.com/suhailkakar)! - Fix: updated the fingerprint for Tus upload. This should fix the issue with the resumable uploads.

- [#120](https://github.com/livepeer/livepeer.js/pull/120) [`86d9a69`](https://github.com/livepeer/livepeer.js/commit/86d9a69d82c32f841fc4e460c59267146ecf754c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated the Player metrics endpoint to use the correct ports for staging and canary environments.

- [#129](https://github.com/livepeer/livepeer.js/pull/129) [`543560c`](https://github.com/livepeer/livepeer.js/commit/543560c6b9bb25352c4cdfce4dc56d0405592f6d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added automatic fetching/importing of Arweave URLs to the Player.

  An Arweave URL (such as `ar://<HASH>`, `https://<SUBDOMAIN>.arweave.dev/<HASH>` or `https://arweave.net/<HASH>`, _but cannot be a directory_) can be passed as the `src` or `playbackID` to the Player, and it will automatically detect if it is a valid Arweave URL and attempt to fetch the playback info. If the API does not have an Asset with the corresponding Arweave transaction hash, the Player will automatically attempt to import the Arweave content, and then play the transcoded content back.

- Updated dependencies [[`f5b370c`](https://github.com/livepeer/livepeer.js/commit/f5b370cfb94f57c1075dbd9f211b6881bb0da017), [`86d9a69`](https://github.com/livepeer/livepeer.js/commit/86d9a69d82c32f841fc4e460c59267146ecf754c), [`543560c`](https://github.com/livepeer/livepeer.js/commit/543560c6b9bb25352c4cdfce4dc56d0405592f6d)]:
  - livepeer@1.2.2

## 1.2.1

### Patch Changes

- [#113](https://github.com/livepeer/livepeer.js/pull/113) [`488bdcd`](https://github.com/livepeer/livepeer.js/commit/488bdcd31396be770190530b0f608fead01deb15) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved metrics addition to be a single function which handles fetching the reporting URL internally.

- [#107](https://github.com/livepeer/livepeer.js/pull/107) [`8aeb0b9`](https://github.com/livepeer/livepeer.js/commit/8aeb0b9a8f35407521f373f006bc8dc5482d303d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added automatic fetching/importing of IPFS URLs to the Player.

  An IPFS [v0 or v1 CID](https://docs.ipfs.tech/concepts/content-addressing/) or URL (such as `ipfs://<CID>`, `https://<CID>.ipfs.dweb.link/` or `https://cloudflare-ipfs.com/ipfs/<CID>`, _but cannot be a directory_) can be passed as the `src` or `playbackID` to the Player, and it will automatically detect if it is a valid CID and attempt to fetch the playback info for the CID. If the API does not have an Asset with the corresponding CID, the Player will automatically attempt to import the CID from IPFS, and then play the transcoded content back.

- [#115](https://github.com/livepeer/livepeer.js/pull/115) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** changed the z-index to hide browser controls on the Player to only be applied on fullscreen.

- Updated dependencies [[`488bdcd`](https://github.com/livepeer/livepeer.js/commit/488bdcd31396be770190530b0f608fead01deb15), [`8aeb0b9`](https://github.com/livepeer/livepeer.js/commit/8aeb0b9a8f35407521f373f006bc8dc5482d303d), [`aab12d4`](https://github.com/livepeer/livepeer.js/commit/aab12d4b8815d04519b8b95746e76e7177784c7a)]:
  - livepeer@1.2.1

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

- [`d43c04a`](https://github.com/livepeer/livepeer.js/commit/d43c04ade7cfaf18800508a7da31d99b9989f931) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix**: added `ObjectFit` type to exports.

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
