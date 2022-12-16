# @livepeer/react

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
