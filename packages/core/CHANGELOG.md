# @livepeer/core

## 1.2.3

### Patch Changes

- [#286](https://github.com/livepeer/livepeer.js/pull/286) [`cd502da`](https://github.com/livepeer/livepeer.js/commit/cd502da49908d70ceab241a84a4a670b1a54f701) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** renamed the `protocol` field to `sourceType` to align with the backend metrics websocket.

## 1.2.2

### Patch Changes

- [#284](https://github.com/livepeer/livepeer.js/pull/284) [`620751e`](https://github.com/livepeer/livepeer.js/commit/620751efbf1108ce207e5b83f67e28f9e7dd263e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added better logs for failure on `create` in Studio provider.

## 1.2.1

### Patch Changes

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `usePlayerList` to use a React ref to avoid dynamic runtime `onViewableItemsChanged` errors.

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed uploads in React Native environments by removing chunk size for tus.

- [#272](https://github.com/livepeer/livepeer.js/pull/272) [`b11ea90`](https://github.com/livepeer/livepeer.js/commit/b11ea90bb3e488bd6d6661846313849adf389cdf) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `allowCrossOriginCredentials` to the React Player to allow cookies to be sent with playback requests.

- [#270](https://github.com/livepeer/livepeer.js/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer.js/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `getIsVolumeChangeSupported` check to not fail for negative volume values.

## 1.2.0

### Minor Changes

- [#267](https://github.com/livepeer/livepeer.js/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added MP4 rendition prioritization to the React and React Native Player.

  This is for support of MP4 renditions returned from `playbackInfo` from the Studio provider. If an MP4 rendition exists for an Asset, it will be prioritized over HLS, since this has been introduced as a performance improvement over HLS for short-form video.

  The MP4 renditions will be chosen with the following algorithm: the device screen width and multiplied by a static multiplier (currently set to x2.5). This value is then compared to the rendition widths, and the renditions are prioritized based on the distance between these values. This results in a choice of a rendition which is close to the screen size without visual quality issues. For instance, a device with a 1280 pixel width would compute `1280px * 2.5 = 3200px`, and then sort the MP4 renditions by which are closest to this value.

### Patch Changes

- [#267](https://github.com/livepeer/livepeer.js/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer.js/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `pageUrl`, `protocol`, `preloadTime`, and `autoplay` to metrics to track performance of video load under specific conditions.

## 1.1.5

### Patch Changes

- [#265](https://github.com/livepeer/livepeer.js/pull/265) [`318c082`](https://github.com/livepeer/livepeer.js/commit/318c0824a62cffa69c92ba4eb6c45afbb9920958) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** change the metrics reporting port for staging to use 443.

## 1.1.4

### Patch Changes

- [#259](https://github.com/livepeer/livepeer.js/pull/259) [`9568500`](https://github.com/livepeer/livepeer.js/commit/95685009dcb4a2d86b2def2325ade9ddd6d13d1b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added Time to First Frame, Autoplay, and User Agent to metrics reporting. Fixed bugs with play time metrics reporting.

## 1.1.3

### Patch Changes

- [#255](https://github.com/livepeer/livepeer.js/pull/255) [`0e5cbc9`](https://github.com/livepeer/livepeer.js/commit/0e5cbc98116332260178de3aa188db53b9f5f22c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed Node.js issue with `File` not being defined globally.

## 1.1.2

### Patch Changes

- [`a8a2c58`](https://github.com/livepeer/livepeer.js/commit/a8a2c582da2eb49ef33fca27587129ce1c1bfaa6) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** downgraded packages due to versioning conflicts and upgraded `zustand`.

## 1.1.1

### Patch Changes

- [#248](https://github.com/livepeer/livepeer.js/pull/248) [`5a1c060`](https://github.com/livepeer/livepeer.js/commit/5a1c0606fc3ab1703a74ca02b18acfa93937d684) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed version headers to reference the correct package names.

- [#251](https://github.com/livepeer/livepeer.js/pull/251) [`686fb51`](https://github.com/livepeer/livepeer.js/commit/686fb5178a5746210cc16f1efb77f2c1273f4527) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated dependencies to latest versions.

## 1.1.0

### Minor Changes

- [#240](https://github.com/livepeer/livepeer.js/pull/240) [`c4cb597`](https://github.com/livepeer/livepeer.js/commit/c4cb59762a31c865bb8ada9a4176caa614f6be7a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

## 1.0.0

### Major Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

### Minor Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).

### Patch Changes

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

- [#213](https://github.com/livepeer/livepeer.js/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

## 1.0.0-next.6

### Minor Changes

- [#212](https://github.com/livepeer/livepeer.js/pull/212) [`da28e70`](https://github.com/livepeer/livepeer.js/commit/da28e7037a50e4a3ac3711581cc762f516e5f31a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

## 1.0.0-next.5

### Patch Changes

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer.js/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer.js/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

## 1.0.0-next.4

### Patch Changes

- [#213](https://github.com/livepeer/livepeer.js/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer.js/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

## 1.0.0-next.3

### Patch Changes

- [#204](https://github.com/livepeer/livepeer.js/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer.js/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

## 1.0.0-next.2

### Patch Changes

- [#195](https://github.com/livepeer/livepeer.js/pull/195) [`e866579`](https://github.com/livepeer/livepeer.js/commit/e86657964e2dd9d141d7d06023207ae88d5c4169) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

## 1.0.0-next.1

### Patch Changes

- [#187](https://github.com/livepeer/livepeer.js/pull/187) [`44adf29`](https://github.com/livepeer/livepeer.js/commit/44adf2940ae3621038d87f1444b18398a57d399e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

## 1.0.0-next.0

### Major Changes

- [#182](https://github.com/livepeer/livepeer.js/pull/182) [`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

### Minor Changes

- [#182](https://github.com/livepeer/livepeer.js/pull/182) [`16b1307`](https://github.com/livepeer/livepeer.js/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).
