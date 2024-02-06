# @livepeer/core

## 3.0.2

### Patch Changes

- [#472](https://github.com/livepeer/livepeer-kit/pull/472) [`89aec9c`](https://github.com/livepeer/livepeer-kit/commit/89aec9c5cf0deecf483130dae2036980bd456c97) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `hlsConfig` to `<Player.Video />`, `autohide` to `<Controls />`, and miscellaneous fixes for player and broadcast.

## 3.0.1

### Patch Changes

- [#470](https://github.com/livepeer/livepeer-react/pull/470) [`81ead35`](https://github.com/livepeer/livepeer-react/commit/81ead3529e3522993cbf2ca6737c601e735ad2ec) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the interface for broadcasting (and player) to be vendor agnostic. This now uses `getIngest` similar to the `getSrc` for Player, which attempts to parse out a WHIP ingest URL.
  This has been tested against Cloudflare's WHIP/WHEP offering.

## 3.0.0

### Major Changes

- [#459](https://github.com/livepeer/livepeer-react/pull/459) [`8463de1`](https://github.com/livepeer/livepeer-react/commit/8463de1dfb77394e009ce4938cf8ea94cefce250) Thanks [@0xcadams](https://github.com/0xcadams)! - **Major release:** first preview release of the unstyled, composable `<Player />` and `<Broadcast />` primitives based on [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction).

### The motivation

This is a ground-up rewrite of most of the `@livepeer/react` library. In this release, we had some problems we wanted to solve:

1. The `<Player />`/`<Broadcast />` components are not very composable. They essentially break with any type of customization.
2. They encapsulate a lot of application logic (fetching data from the backend, auto-upload, etc) and the Player pushes CORS API keys, which are not a good security practice and cause a lot of developer confusion.
3. The styling is difficult and hard to rework as a developer (and not compatible with Server Components).
4. The react native package is under-maintained and far behind the web player in terms of features/support.

### Our approach

1. Break out the logic of the components to be more composable. Instead of a single `<Player />`, there is now a `<Player.Root />`, `<Player.Container />`, `<Player.Video />`, `<Player.LoadingIndicator />`, `<Player.FullscreenTrigger />`, `<Player.FullscreenIndicator />`, etc. Very similar to Radix, which we use under the hood.
   - This means that instead of one giant component with a lot of logic baked into it, we have a bunch of composable primitives which you can build your apps on top of. We hope you like it!
   - This also brings us much closer to web standards - we don't want to hide the internals from you. You can pass props directly to the video element, like `poster`, and it will "just work" as expected.
   - We still provide a lot of auto-wiring for the components and event listeners - very similar to the previous versions.
2. We removed all API data fetching on the Player (e.g. all of the hooks like `useCreateAsset`), and now provide helpers to use the new [`livepeer`](https://github.com/livepeer/livepeer-js) SDK with the React components.
   - [`getSrc`](https://github.com/livepeer/livepeer-react/blob/f3da0ffd9578932bc9d4e4ce0119cdb90432d84a/packages/core/src/media/external.ts#L18) takes in the response from the playback info endpoint and parses it into something the Player can understand.
   - The only web requests are for pure playback or broadcasting (WHEP/WHIP and metrics reporting) - **there are no more API requests to Livepeer Studio from any components.**
   - This means that you **do not need to configure** a `LivepeerProvider` with an API key. Keep those keys on the backend.
3. The components are now completely unstyled, and the docs will provide examples of how to style them similarly to how they were in the previous releases. You can copy-pasta and then tweak from there.
4. We deprecated the React Native package, for now. It would have been a huge lift to bring it up to feature parity with the React package, and is less straightforward than web to do the WebRTC/HLS fallback and all of the advanced features in the React web package.
   - We want to have first-class support for React Native in the future, but for now, we want to only ship software that we're 100% confident our users will benefit from.

### New features & fixes

- **Composable components** - all components are extremely narrow in their scope, and support the [`asChild` pattern](https://www.radix-ui.com/primitives/docs/guides/composition) popularized by Radix UI. When `asChild` is set to true, we will not render a default DOM element, instead cloning the part's child and passing it the props and behavior required to make it functional.
- **Automatic poster images** - if you pass in the playback info response directly into `getSrc`, it will automatically parse the thumbnail image and pass it into the `poster` for the video.
- **Resume progress on fallback** - now, when an error happens during playback for any reason, we resume playback where it left off.
- **BYOC** - bring your own components. `useMediaContext` is now much easier to use - since the `<Player.Root />` is now just a simple React Context provider, you can build out your own components inside of it which consume the video controller. We have some examples to help avoid the footgunning.

### Callouts

- We are dropping support for `autoUrlUpload` and the fallback to playing directly from IPFS. We understand some users rely on that, and we will work with them to provide docs for how to implement that outside of the player.
- We moved to a new build system which includes `use client` and `use server` directives in the output. If you don't use React Server Components, this doesn't affect you. But this means that you can directly import the client components into a RSC and you don't need to wrap them.

### Patch Changes

- [#459](https://github.com/livepeer/livepeer-react/pull/459) [`8463de1`](https://github.com/livepeer/livepeer-react/commit/8463de1dfb77394e009ce4938cf8ea94cefce250) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the broadcast experience to handle display media and included a settings popover in the demo Next.js app.

- [#459](https://github.com/livepeer/livepeer-react/pull/459) [`8463de1`](https://github.com/livepeer/livepeer-react/commit/8463de1dfb77394e009ce4938cf8ea94cefce250) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** small fixes for ARIA keyboard shortcuts, resizing CSS variables, permissions errors in broadcasting, and usability fixes.

- [#459](https://github.com/livepeer/livepeer-react/pull/459) [`8463de1`](https://github.com/livepeer/livepeer-react/commit/8463de1dfb77394e009ce4938cf8ea94cefce250) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed syncing of MediaStream with audio/video enabled, UI tweaks, CSS variables for media width/height, and more.

## 3.0.0-next.2

### Patch Changes

- [#465](https://github.com/livepeer/livepeer-react/pull/465) [`158f13f`](https://github.com/livepeer/livepeer-react/commit/158f13fd3d883ea71aeb80fdec2185f558de1267) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** small fixes for ARIA keyboard shortcuts, resizing CSS variables, permissions errors in broadcasting, and usability fixes.

- [#463](https://github.com/livepeer/livepeer-react/pull/463) [`cea94f5`](https://github.com/livepeer/livepeer-react/commit/cea94f50bea84c81f0049bd9aeb3c20f2db38631) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed syncing of MediaStream with audio/video enabled, UI tweaks, CSS variables for media width/height, and more.

## 3.0.0-next.1

### Patch Changes

- [#460](https://github.com/livepeer/livepeer-react/pull/460) [`4847132`](https://github.com/livepeer/livepeer-react/commit/4847132c1ce5acbf3cb8b5a9526f7149ec86063f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the broadcast experience to handle display media and included a settings popover in the demo Next.js app.

## 3.0.0-next.0

### Major Changes

- [#456](https://github.com/livepeer/livepeer-react/pull/456) [`4669aaf`](https://github.com/livepeer/livepeer-react/commit/4669aaff3c142fbad99c1ae350eda0229f33df72) Thanks [@0xcadams](https://github.com/0xcadams)! - **Major release:** first preview release of the unstyled, composable `<Player />` and `<Broadcast />` primitives based on [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction).

### The motivation

This is a ground-up rewrite of most of the `@livepeer/react` library. In this release, we had some problems we wanted to solve:

1. The `<Player />`/`<Broadcast />` components are not very composable. They essentially break with any type of customization.
2. They encapsulate a lot of application logic (fetching data from the backend, auto-upload, etc) and the Player pushes CORS API keys, which are not a good security practice and cause a lot of developer confusion.
3. The styling is difficult and hard to rework as a developer (and not compatible with Server Components).
4. The react native package is under-maintained and far behind the web player in terms of features/support.

### Our approach

1. Break out the logic of the components to be more composable. Instead of a single `<Player />`, there is now a `<Player.Root />`, `<Player.Container />`, `<Player.Video />`, `<Player.LoadingIndicator />`, `<Player.FullscreenTrigger />`, `<Player.FullscreenIndicator />`, etc. Very similar to Radix, which we use under the hood.
   - This means that instead of one giant component with a lot of logic baked into it, we have a bunch of composable primitives which you can build your apps on top of. We hope you like it!
   - This also brings us much closer to web standards - we don't want to hide the internals from you. You can pass props directly to the video element, like `poster`, and it will "just work" as expected.
   - We still provide a lot of auto-wiring for the components and event listeners - very similar to the previous versions.
2. We removed all API data fetching on the Player (e.g. all of the hooks like `useCreateAsset`), and now provide helpers to use the new [`livepeer`](https://github.com/livepeer/livepeer-js) SDK with the React components.
   - [`getSrc`](https://github.com/livepeer/livepeer-react/blob/f3da0ffd9578932bc9d4e4ce0119cdb90432d84a/packages/core/src/media/external.ts#L18) takes in the response from the playback info endpoint and parses it into something the Player can understand.
   - The only web requests are for pure playback or broadcasting (WHEP/WHIP and metrics reporting) - **there are no more API requests to Livepeer Studio from any components.**
   - This means that you **do not need to configure** a `LivepeerProvider` with an API key. Keep those keys on the backend.
3. The components are now completely unstyled, and the docs will provide examples of how to style them similarly to how they were in the previous releases. You can copy-pasta and then tweak from there.
4. We deprecated the React Native package, for now. It would have been a huge lift to bring it up to feature parity with the React package, and is less straightforward than web to do the WebRTC/HLS fallback and all of the advanced features in the React web package.
   - We want to have first-class support for React Native in the future, but for now, we want to only ship software that we're 100% confident our users will benefit from.

### New features & fixes

- **Composable components** - all components are extremely narrow in their scope, and support the [`asChild` pattern](https://www.radix-ui.com/primitives/docs/guides/composition) popularized by Radix UI. When `asChild` is set to true, we will not render a default DOM element, instead cloning the part's child and passing it the props and behavior required to make it functional.
- **Automatic poster images** - if you pass in the playback info response directly into `getSrc`, it will automatically parse the thumbnail image and pass it into the `poster` for the video.
- **Resume progress on fallback** - now, when an error happens during playback for any reason, we resume playback where it left off.
- **BYOC** - bring your own components. `useMediaContext` is now much easier to use - since the `<Player.Root />` is now just a simple React Context provider, you can build out your own components inside of it which consume the video controller. We have some examples to help avoid the footgunning.

### Callouts

- We are dropping support for `autoUrlUpload` and the fallback to playing directly from IPFS. We understand some users rely on that, and we will work with them to provide docs for how to implement that outside of the player.
- We moved to a new build system which includes `use client` and `use server` directives in the output. If you don't use React Server Components, this doesn't affect you. But this means that you can directly import the client components into a RSC and you don't need to wrap them.

## 2.1.9

### Patch Changes

- [#448](https://github.com/livepeer/livepeer-react/pull/448) [`26204f4`](https://github.com/livepeer/livepeer-react/commit/26204f4706798ce2db37ba11f620a867ca778b4d) Thanks [@suhailkakar](https://github.com/suhailkakar)! - Added .quicktime extension to mime.ts and src.ts to allow .quicktime video playback

## 2.1.8

### Patch Changes

- [#446](https://github.com/livepeer/livepeer-react/pull/446) [`373e3ac`](https://github.com/livepeer/livepeer-react/commit/373e3acf54d5952ac08085a0a60ea6efa73cf064) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added access control headers to every request for HLS VOD.

## 2.1.7

### Patch Changes

- [#444](https://github.com/livepeer/livepeer-react/pull/444) [`6057932`](https://github.com/livepeer/livepeer-react/commit/60579322fb387f60e86ebb93fecb289172496e64) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed an issue where all HLS requests with JWT headers will time out.

## 2.1.6

### Patch Changes

- [#442](https://github.com/livepeer/livepeer-react/pull/442) [`f6ddf09`](https://github.com/livepeer/livepeer-react/commit/f6ddf097290549fb360996aaa5638d7691071a2d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolves issue with VPNs transparently blocking WebRTC playback and failing to start.

  The timeout for playback can be customized with `webrtcConfig.canPlayTimeout`:

  ```tsx
  import { Player, WebRTCVideoConfig } from "@livepeer/react";

  const webrtcConfig: WebRTCVideoConfig = {
    canPlayTimeout: 8000,
  };

  const Page = () => {
    return <Player playbackId={playbackId} webrtcConfig={webrtcConfig} />;
  };
  ```

## 2.1.5

### Patch Changes

- [#439](https://github.com/livepeer/livepeer-react/pull/439) [`d9104a3`](https://github.com/livepeer/livepeer-react/commit/d9104a32c64ab15646c1c777f266b41f653f2b62) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed playback on iOS for JWT-protected HLS playback.

## 2.1.4

### Patch Changes

- [#437](https://github.com/livepeer/livepeer-react/pull/437) [`714f354`](https://github.com/livepeer/livepeer-react/commit/714f3547a4c55d40b8ea0ab9e8f3d2bead0d18f8) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added back `webrtcConfig` to the dependencies for WebRTC negotiation useEffect.

## 2.1.3

### Patch Changes

- [#434](https://github.com/livepeer/livepeer-react/pull/434) [`ad3009c`](https://github.com/livepeer/livepeer-react/commit/ad3009c71bc713a0fa43f2f04ed8f51fe294f12f) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** removed `?recordings=true` parameter on playback info endpoint and fixed HLS CORS issues with JWT headers.

- [#432](https://github.com/livepeer/livepeer-react/pull/432) [`b3081f3`](https://github.com/livepeer/livepeer-react/commit/b3081f34158544b42ef2135d6c7a177d20636873) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed to use `HEAD` instead of `GET` and removed listener for changes to `webrtcConfig` to reduce developer confusion.

- [#435](https://github.com/livepeer/livepeer-react/pull/435) [`b83480c`](https://github.com/livepeer/livepeer-react/commit/b83480c6256e4dfe0311434890ffcfe74a0b7fde) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix for metrics reporting when switching quickly between streams.

## 2.1.2

### Patch Changes

- [#430](https://github.com/livepeer/livepeer-react/pull/430) [`82fbbd6`](https://github.com/livepeer/livepeer-react/commit/82fbbd6b488b897ee5d91a21d22534b7a98a57a7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Revert:** revert VPN playback hanging.

## 2.1.1

### Patch Changes

- [#423](https://github.com/livepeer/livepeer-react/pull/423) [`2743a30`](https://github.com/livepeer/livepeer-react/commit/2743a30b4e07a8b686a0937a10af106b01ff1415) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added header-based access control for webrtc and hls.

## 2.1.0

### Minor Changes

- [#426](https://github.com/livepeer/livepeer-react/pull/426) [`ab4da5f`](https://github.com/livepeer/livepeer-react/commit/ab4da5f1203f6dd235389cbe9d2e0b49583c536d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added track selectors to WebRTC so developers can override video and audio tracks.

  ```tsx
  <Player
    webrtcConfig={{
      videoTrackSelector: "~1280x720",
    }}
  />
  ```

  See [here](https://docs.mistserver.org/mistserver/concepts/track_selectors/) for more documentation.

### Patch Changes

- [#424](https://github.com/livepeer/livepeer-react/pull/424) [`c1a871a`](https://github.com/livepeer/livepeer-react/commit/c1a871af1f2a7c616496f889a8359db1748527b7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added timeout for VPN playback blocking ICE candidates and stalling indefinitely. The default is 5000ms with an override with:

  ```tsx
  <Player
    webrtcConfig={{
      iceCandidateTimeout: 2000,
    }}
  />
  ```

- [#427](https://github.com/livepeer/livepeer-react/pull/427) [`d453ebc`](https://github.com/livepeer/livepeer-react/commit/d453ebce05404ebabe1ba4847f2fb135f7c07740) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed a rare bug where coturn could be located in a different region from playback, resulting in playback failing.

## 2.0.10

### Patch Changes

- [#418](https://github.com/livepeer/livepeer-react/pull/418) [`7b6b1d7`](https://github.com/livepeer/livepeer-react/commit/7b6b1d782abf2a2b8bcfa7f74fa11c2d8d31e7e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed WebRTC negotiation endpoint to reduce hops to assigned node.

## 2.0.9

### Patch Changes

- [#416](https://github.com/livepeer/livepeer-react/pull/416) [`d4f9abe`](https://github.com/livepeer/livepeer-react/commit/d4f9abee791cc7c41c7b78572f10b6ed495e93a1) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added redirect URL caching for faster WebRTC playback switching times.

## 2.0.8

### Patch Changes

- [`fadfa23`](https://github.com/livepeer/livepeer-react/commit/fadfa23527997678ef810d01b463b30c54a80e50) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the metrics URL to always use the URL for playback. This fixes the edge case where playback and metrics are assigned to different nodes.

## 2.0.7

### Patch Changes

- [#413](https://github.com/livepeer/livepeer-react/pull/413) [`b8ba1f3`](https://github.com/livepeer/livepeer-react/commit/b8ba1f37772b3a35719d581344ff7d0acd44ea91) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed random `Stream is offline` errors occurring on live stream playback, and reporting to websocket metrics.

## 2.0.6

### Patch Changes

- [#411](https://github.com/livepeer/livepeer-react/pull/411) [`c627b39`](https://github.com/livepeer/livepeer-react/commit/c627b39d4708090ba87eb9fda90f29f4a5478d04) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed properly closing the playback websocket when a new playback ID is passed into the Player.

## 2.0.5

### Patch Changes

- [#408](https://github.com/livepeer/livepeer-react/pull/408) [`f396e37`](https://github.com/livepeer/livepeer-react/commit/f396e37a477ce8ee38853b3a6e5ec78265d2c914) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed parsing of playback IDs from a pinned playback URL.

## 2.0.4

### Patch Changes

- [#406](https://github.com/livepeer/livepeer-react/pull/406) [`570342f`](https://github.com/livepeer/livepeer-react/commit/570342fc3e4570006c458a161f6edff9ef4de004) Thanks [@victorges](https://github.com/victorges)! - **Fix:** fixed metrics to only send values when they are defined, to avoid filtering on the backend.

## 2.0.3

### Patch Changes

- [#403](https://github.com/livepeer/livepeer-react/pull/403) [`2d29716`](https://github.com/livepeer/livepeer-react/commit/2d297160a42dc17893e15342e0344139e385d873) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed a race condition when b-frames are present in a stream, and fallback happens to HLS while SDP negotiation is still pending.

## 2.0.2

### Patch Changes

- [#401](https://github.com/livepeer/livepeer-react/pull/401) [`06095b6`](https://github.com/livepeer/livepeer-react/commit/06095b61ce6d2171f7aced300d7cf00566fdd597) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolved issues with WebRTC not playing back correctly on Firefox.

## 2.0.1

### Patch Changes

- [#398](https://github.com/livepeer/livepeer-react/pull/398) [`8ce5d5c`](https://github.com/livepeer/livepeer-react/commit/8ce5d5ccd6b69f5783783b4abdc00c69c648030e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added loading states to the clipping button in the Player, with better callbacks for users to implement UIs on top of clipping.

## 2.0.0

### Major Changes

- [#395](https://github.com/livepeer/livepeer-react/pull/395) [`119c28b`](https://github.com/livepeer/livepeer-react/commit/119c28b64d6f6d0e0948d0477feb7999f6e331d5) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** moved `livepeer` to `@livepeer/core-web`, which will be aligned with our `livepeer` packages that are 1-1 with the backend API.

## 1.9.2

### Patch Changes

- [#394](https://github.com/livepeer/livepeer-react/pull/394) [`5d5048d`](https://github.com/livepeer/livepeer-react/commit/5d5048d4854c55f8f452ce969d2adcaf4c5b5dc3) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated clipping to include an optional session ID.

## 1.9.1

### Patch Changes

- [#392](https://github.com/livepeer/livepeer-react/pull/392) [`b8e2831`](https://github.com/livepeer/livepeer-react/commit/b8e2831ffde3b7cc87dde7e5030dfcee10adb57c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added better error handling for HLS.js buffer append errors.

## 1.9.0

### Minor Changes

- [#390](https://github.com/livepeer/livepeer-react/pull/390) [`961772d`](https://github.com/livepeer/livepeer-react/commit/961772da5eb0dc85da045841aef14b7c6b9386ac) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed `playbackUrl` from stream responses. Developers should migrate to using `playbackId` to query stream playback URLs.

## 1.8.8

### Patch Changes

- [#388](https://github.com/livepeer/livepeer-react/pull/388) [`6095d73`](https://github.com/livepeer/livepeer-react/commit/6095d73fbfd469f5148479d757d90e81ed8569db) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `onClipStarted` and ensured overridden `liveSyncDurationCount` in HLS config does not throw errors in HLS.js.

## 1.8.7

### Patch Changes

- [#386](https://github.com/livepeer/livepeer-react/pull/386) [`1dc5657`](https://github.com/livepeer/livepeer-react/commit/1dc56579028acafcdcb5c45a79fed34855bad1d3) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added constant to WebRTCConfig to allow constant playback speed in the Player, and prevent audio distortion.

- [#383](https://github.com/livepeer/livepeer-react/pull/383) [`9264eee`](https://github.com/livepeer/livepeer-react/commit/9264eee8e6b4b33329f0777db481e77de564bc4c) Thanks [@iameli-streams](https://github.com/iameli-streams)! - **Fix:** added single SDP negotiation when performing WHEP.

## 1.8.6

### Patch Changes

- [#379](https://github.com/livepeer/livepeer-react/pull/379) [`b29684d`](https://github.com/livepeer/livepeer-react/commit/b29684dfcf3259af2637a0d98059ba2a774084b4) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added custom components to render in place of the default error components, for when a stream is offline: `streamOfflineErrorComponent`, when an access control error occurs (like an invalid JWT is passed): `accessControlErrorComponent`, and when playback fails another unknown error: `playbackFailedErrorComponent`.

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

## 1.8.5

### Patch Changes

- [`17f84fd`](https://github.com/livepeer/livepeer-react/commit/17f84fd5dc9091555e240f45c0c54ae90b9e5a3d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** bumping version due to intermittent release error.

## 1.8.4

### Patch Changes

- [#376](https://github.com/livepeer/livepeer-react/pull/376) [`3301827`](https://github.com/livepeer/livepeer-react/commit/33018273c81b6a0482ce1cbb9441b7a1f100bf46) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed to have a cleaner fallback for 406 response from WebRTC negotiation.

## 1.8.3

### Patch Changes

- [#374](https://github.com/livepeer/livepeer-react/pull/374) [`5cbf402`](https://github.com/livepeer/livepeer-react/commit/5cbf4021ce3771d52bc69f2667f1431f6238e44d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the fallback when b-frames exist to not show a playback error until HLS has been attempted.

## 1.8.2

### Patch Changes

- [`d809f28`](https://github.com/livepeer/livepeer-react/commit/d809f28ea71dd0317ae57973a4f85c5d65ad5d0a) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added changes to strip a non-standard port number from the WebRTC redirect host, if present.

## 1.8.1

### Patch Changes

- [#370](https://github.com/livepeer/livepeer-react/pull/370) [`269d3a3`](https://github.com/livepeer/livepeer-react/commit/269d3a3f37845ea643e3c4f281de62347529b988) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fix for TTFF reporting, to measure the difference between the `play` event and the first progress update.

## 1.8.0

### Minor Changes

- [#364](https://github.com/livepeer/livepeer-react/pull/364) [`37c97e7`](https://github.com/livepeer/livepeer-react/commit/37c97e7cfce433e95cb790965acfd069634e66bd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `lowLatency` option of `force` - this requires WebRTC to be used, if a WebRTC playback source exists (which is only for livestreams). It disables the automatic fallback to HLS.

  Fixed issue when `lowLatency` is `true` where it would immediately fall back to HLS - it should now retry if the stream is offline, and fall back to HLS only when there is an unknown error (this could be a variety of causes - intermittent network issues, browser failure, etc).

  The default `lowLatency` option is now `true` - to opt out of low latency, pass `lowLatency=false` to the Player or the lvpr.tv search params.

## 1.7.0

### Minor Changes

- [#362](https://github.com/livepeer/livepeer-react/pull/362) [`5c905ce`](https://github.com/livepeer/livepeer-react/commit/5c905cea6d4375a42403fe0eb95b6e522832741b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** update downstream packages and changed the default icon for microphone mute/unmute in `<Broadcast />`.

  Package updates include:

  - `hls.js` upgraded from "^1.4.0" to "^1.4.9", to include a fix from Livepeer's @Thulinma for missing AUD units
  - `core-js` upgraded from "^3.27.2" to "^3.31.1".
  - `cross-fetch` upgraded from "^3.1.5" to "^4.0.0".
  - `tus-js-client` upgraded from "^3.0.1" to "^3.1.0".
  - `zustand` upgraded from "^4.3.2" to "^4.3.9".
  - `@tanstack/query-async-storage-persister`, `@tanstack/query-core`, `@tanstack/react-query`, `@tanstack/react-query-persist-client` all upgraded from "4.22.4" to "4.29.23".

## 1.6.1

### Patch Changes

- [`a89e71c`](https://github.com/livepeer/livepeer-react/commit/a89e71c5ed24a0b9ba967f844f5dcf148d004837) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** small styling fix for the video/audio source dropdowns.

## 1.6.0

### Minor Changes

- [#358](https://github.com/livepeer/livepeer-react/pull/358) [`50551ce`](https://github.com/livepeer/livepeer-react/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added basic `<Broadcast />` component to kick off WebRTC broadcasting testing.

- [#358](https://github.com/livepeer/livepeer-react/pull/358) [`50551ce`](https://github.com/livepeer/livepeer-react/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added controls for `<Broadcast />` - `<BroadcastSettings />`, `<AudioToggle />`, and `<VideoToggle />`.

- [#358](https://github.com/livepeer/livepeer-react/pull/358) [`50551ce`](https://github.com/livepeer/livepeer-react/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `<Screenshare />` component for Broadcast, which allows a user to share a screen with their WebRTC broadcast.

### Patch Changes

- [#358](https://github.com/livepeer/livepeer-react/pull/358) [`50551ce`](https://github.com/livepeer/livepeer-react/commit/50551cebf04ff64307c95fdce3119ce29dae695b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `renderChildrenOutsideContainer` to both Broadcast and Player, which determines whether the children should be rendered outside of the aspect ratio container. This is used for custom controls, so children of the Player/Broadcast can use
  `useMediaController` without any parent elements.

  Also added `onPlaybackStatusUpdate`, which is a callback that is called when the broadcast status updates.
  **This should be used with `playbackStatusSelector` to limit state updates.**

## 1.6.0-next.2

### Minor Changes

- [#356](https://github.com/livepeer/livepeer-react/pull/356) [`ac886fb`](https://github.com/livepeer/livepeer-react/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `<Screenshare />` component for Broadcast, which allows a user to share a screen with their WebRTC broadcast.

### Patch Changes

- [#356](https://github.com/livepeer/livepeer-react/pull/356) [`ac886fb`](https://github.com/livepeer/livepeer-react/commit/ac886fb0dd3a6aade0da257cf225503d4fb05f00) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `renderChildrenOutsideContainer` to both Broadcast and Player, which determines whether the children should be rendered outside of the aspect ratio container. This is used for custom controls, so children of the Player/Broadcast can use
  `useMediaController` without any parent elements.

  Also added `onPlaybackStatusUpdate`, which is a callback that is called when the broadcast status updates.
  **This should be used with `playbackStatusSelector` to limit state updates.**

## 1.6.0-next.1

### Minor Changes

- [`60b46ad`](https://github.com/livepeer/livepeer-react/commit/60b46add0f0661ab1b95ccf4887ced8f91cb3541) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added controls for `<Broadcast />` - `<BroadcastSettings />`, `<AudioToggle />`, and `<VideoToggle />`.

## 1.6.0-next.0

### Minor Changes

- [#349](https://github.com/livepeer/livepeer-react/pull/349) [`82429d8`](https://github.com/livepeer/livepeer-react/commit/82429d8bd6dbc92d5f7136f445ca408660533d94) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added basic `<Broadcast />` component to kick off WebRTC broadcasting testing.

## 1.5.8

### Patch Changes

- [`4811b3e`](https://github.com/livepeer/livepeer-react/commit/4811b3e42aeb4d42858d2e81b4af127175a722e0) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** thanks @martincik - added `assetId` to the asset upload progress.

- [`7dcda99`](https://github.com/livepeer/livepeer-react/commit/7dcda99453cb204b76f93f5b881c89e1af0cc79d) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bug with `navigator.mediaDevices.getUserMedia` throwing an undefined error in a secure context.

## 1.5.7

### Patch Changes

- [`9811490`](https://github.com/livepeer/livepeer-react/commit/981149007660ab63d7d09d2d30e9f12aa32c0dfa) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** hotfix to improve handling of player version.

## 1.5.6

### Patch Changes

- [#345](https://github.com/livepeer/livepeer-react/pull/345) [`af16f6d`](https://github.com/livepeer/livepeer-react/commit/af16f6dda2360f0734a224fce8ef6326a7e2e513) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** added version identifiers to the playback websocket to help narrow issues related to specific Livepeer Kit releases.

## 1.5.5

### Patch Changes

- [#342](https://github.com/livepeer/livepeer-react/pull/342) [`e36b570`](https://github.com/livepeer/livepeer-react/commit/e36b57025246682d1396226fadf665cf12afed86) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed [Safari not emitting `canplay` event](https://github.com/video-dev/hls.js/issues/1686) with autoplay disabled, and replaced this event with `loadedmetadata` to know when the video is ready for playback.

## 1.5.4

### Patch Changes

- [#340](https://github.com/livepeer/livepeer-react/pull/340) [`99321fb`](https://github.com/livepeer/livepeer-react/commit/99321fb44e130c89fa6e2a0f24082d8a88df9bf7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed WebRTC playback on Safari and removed redundant `HEAD` request in SDP negotiation.

## 1.5.3

### Patch Changes

- [#338](https://github.com/livepeer/livepeer-react/pull/338) [`8efce52`](https://github.com/livepeer/livepeer-react/commit/8efce520a6c5f1c240356360671a434088cab7dd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `creatorId` to useCreateStream, useUpdateStream, and useUpdateAsset.

## 1.5.2

### Patch Changes

- [#336](https://github.com/livepeer/livepeer-react/pull/336) [`effc06b`](https://github.com/livepeer/livepeer-react/commit/effc06bd2c578ca1a4688108062badd9f6a9c802) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed TTFF bug with the Player reporting an inaccurate TTFF when `priority` was used with a Player which is below the fold. This was happening on the lvpr.tv player, since it is always set to `priority` even though the Player can be below the fold.

## 1.5.1

### Patch Changes

- [#334](https://github.com/livepeer/livepeer-react/pull/334) [`8cd5537`](https://github.com/livepeer/livepeer-react/commit/8cd5537fd19e585cb69c9c1f7fb775a76fae9f25) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added a prop, `lowLatency`, to the Player, to allow for opting-in to low latency WebRTC.

## 1.5.0

### Minor Changes

- [#314](https://github.com/livepeer/livepeer-react/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer-react/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added WebRTC playback for the web Player, which uses the new endpoint from the Studio provider to play back WebRTC livestreams, if they are available. If these do not succeed in playing back, the Player will automatically fall back to HLS playback. Also, if the stream contains "bframes" (which are common for users streaming with OBS or other streaming providers), the Player will automatically fall back.

### Patch Changes

- [#332](https://github.com/livepeer/livepeer-react/pull/332) [`7924cb5`](https://github.com/livepeer/livepeer-react/commit/7924cb5276697386a131046cffe1552347ce27bb) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed default track selector to `first` and loosened video track selector type defs to allow any string.

- [#320](https://github.com/livepeer/livepeer-react/pull/320) [`c49706d`](https://github.com/livepeer/livepeer-react/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed error reporting for metrics websocket with MP4 playback.

- [#329](https://github.com/livepeer/livepeer-react/pull/329) [`be5a1cc`](https://github.com/livepeer/livepeer-react/commit/be5a1cc701065150f35271bff1259dd3dbe06692) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bugs on iOS - use native playback for HLS (instead of HLS.js) and fixed single touch not seeking on Progress.

- [#324](https://github.com/livepeer/livepeer-react/pull/324) [`4c6e1c7`](https://github.com/livepeer/livepeer-react/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolved continuous restart on playback errors and reworked player to only create a single websocket across playbacks.

- [#330](https://github.com/livepeer/livepeer-react/pull/330) [`24111d4`](https://github.com/livepeer/livepeer-react/commit/24111d4902058dbcec6ef3d2e73e396e7ffe8604) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** enable prioritization of WebRTC playback over HLS.

- [#333](https://github.com/livepeer/livepeer-react/pull/333) [`ad1781c`](https://github.com/livepeer/livepeer-react/commit/ad1781c42eab5a6eb41564bea3f8c3ab287cca1e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** removed the video track selector due to an upstream bug, and added configurable timeout for SDP negotiation.

- [#325](https://github.com/livepeer/livepeer-react/pull/325) [`d2c76a6`](https://github.com/livepeer/livepeer-react/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added debouncing to the error handler to increment the source index with exponential backoff, to prevent any fast reloads.

- [#327](https://github.com/livepeer/livepeer-react/pull/327) [`bbb2727`](https://github.com/livepeer/livepeer-react/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolve tus upload issue with large uploads (>1GB) going over nginx limit.

- [#322](https://github.com/livepeer/livepeer-react/pull/322) [`e15a399`](https://github.com/livepeer/livepeer-react/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed issue with release not using the latest changes to MP4 restart.

## 1.5.0-next.4

### Patch Changes

- [#329](https://github.com/livepeer/livepeer-react/pull/329) [`be5a1cc`](https://github.com/livepeer/livepeer-react/commit/be5a1cc701065150f35271bff1259dd3dbe06692) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed bugs on iOS - use native playback for HLS (instead of HLS.js) and fixed single touch not seeking on Progress.

- [#327](https://github.com/livepeer/livepeer-react/pull/327) [`bbb2727`](https://github.com/livepeer/livepeer-react/commit/bbb27278ece20acda11c8fb1a78d1f26d9f73f0e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolve tus upload issue with large uploads (>1GB) going over nginx limit.

## 1.5.0-next.3

### Patch Changes

- [#325](https://github.com/livepeer/livepeer-react/pull/325) [`d2c76a6`](https://github.com/livepeer/livepeer-react/commit/d2c76a68b789df066880e62f2713d8a06fa1ea1c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added debouncing to the error handler to increment the source index with exponential backoff, to prevent any fast reloads.

## 1.5.0-next.2

### Patch Changes

- [#324](https://github.com/livepeer/livepeer-react/pull/324) [`4c6e1c7`](https://github.com/livepeer/livepeer-react/commit/4c6e1c781d362e2cf43cf18d200491ee652a1213) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** resolved continuous restart on playback errors and reworked player to only create a single websocket across playbacks.

- [#322](https://github.com/livepeer/livepeer-react/pull/322) [`e15a399`](https://github.com/livepeer/livepeer-react/commit/e15a3993e9a3e9b6d6517f0af01405f1057654ad) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed issue with release not using the latest changes to MP4 restart.

## 1.5.0-next.1

### Patch Changes

- [#320](https://github.com/livepeer/livepeer-react/pull/320) [`c49706d`](https://github.com/livepeer/livepeer-react/commit/c49706d816bc9048db29e6eac9fa44135ccd71fd) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed error reporting for metrics websocket with MP4 playback.

## 1.5.0-next.0

### Minor Changes

- [#314](https://github.com/livepeer/livepeer-react/pull/314) [`49c4c99`](https://github.com/livepeer/livepeer-react/commit/49c4c99f9b044afc37072517db8eda1d94b4c377) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** Added WebRTC playback for the web Player, which uses the new endpoint from the Studio provider to play back WebRTC livestreams, if they are available. If these do not succeed in playing back, the Player will automatically fall back to HLS playback. Also, if the stream contains "bframes" (which are common for users streaming with OBS or other streaming providers), the Player will automatically fall back.

## 1.4.4

### Patch Changes

- [#315](https://github.com/livepeer/livepeer-react/pull/315) [`f7246ca`](https://github.com/livepeer/livepeer-react/commit/f7246ca6e4d62758f46bf6c282c632ac97ffc654) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added creator ID to create asset, so users can provide either a string (which is an unverified address) or an object with a `type`. We currently only support `unverified` types, which means that passing a verified signature to verify the address is not yet possible.

  ```tsx
  type CreateAssetCreatorId =
    | {
        /**
         * The `type` of the identifier - unverified means that the value is not signed, and is an address
         * that is blindly trusted.
         */
        type: "unverified";
        /**
         * Developer-managed ID of the user who created the asset.
         */
        value: string;
      }
    | string;
  ```

## 1.4.3

### Patch Changes

- [#310](https://github.com/livepeer/livepeer-react/pull/310) [`f840c70`](https://github.com/livepeer/livepeer-react/commit/f840c70f25a4688d66453db778931db029691866) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed blank source URLs on lvpr.tv.

- [`c8050be`](https://github.com/livepeer/livepeer-react/commit/c8050be34e8056abccaae595df6c6d3153e44fef) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:**: added the ability to pass in a `viewerId` to the Player to pass along to the metrics endpoint, for application builders to be able to query viewership by wallet.

- [`c8050be`](https://github.com/livepeer/livepeer-react/commit/c8050be34e8056abccaae595df6c6d3153e44fef) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:**: fix from @Tiagogv to resolve import errors due to the most recent HLS.js release.

## 1.4.2

### Patch Changes

- [#306](https://github.com/livepeer/livepeer-react/pull/306) [`07f4a6e`](https://github.com/livepeer/livepeer-react/commit/07f4a6e3e257834611481325cbe7c7617ec9bf43) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed access control error not resetting when livestream starts.

## 1.4.1

### Patch Changes

- [#304](https://github.com/livepeer/livepeer-react/pull/304) [`d2522dd`](https://github.com/livepeer/livepeer-react/commit/d2522dd5d9dffce55c1c9d6f18c4db2b1b7eccda) Thanks [@spreadzp](https://github.com/spreadzp)! - **Feature:** added support for base64 video sources - this allows for a video source like `data:video/webm;base64,GkX...AUL3` to be passed into the `src` prop and the Player will handle it properly.

## 1.4.0

### Minor Changes

- [#299](https://github.com/livepeer/livepeer-react/pull/299) [`ec96b12`](https://github.com/livepeer/livepeer-react/commit/ec96b12243b3688ddff9a55db1a03454d0af0e25) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `accessKey` and `onAccessKeyRequest` props to the Player, to support the `webhook` playback policy which allows users to play back streams/assets with webhook authentication. The access key is appended to the query string in the source URL of the video, and this access key is passed along to a user-defined webhook which validates the payload to make sure the user has access to the content.

### Patch Changes

- [#303](https://github.com/livepeer/livepeer-react/pull/303) [`8f65da8`](https://github.com/livepeer/livepeer-react/commit/8f65da8771771629da6c9fa5a55cce0447966d32) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** updated the metrics to send the `pageUrl` as the `document.referrer` when used in an iFrame context, to be able to attribute metrics to a page which uses an iFrame.

- [#302](https://github.com/livepeer/livepeer-react/pull/302) [`4ebec15`](https://github.com/livepeer/livepeer-react/commit/4ebec150d92f64be31fcb78e9db64c8af6a24f79) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added an `onError` callback to the Player to allow users to catch and handle miscellaneous errors which occur in the Player, which are not already handled.

## 1.3.2

### Patch Changes

- [#298](https://github.com/livepeer/livepeer-react/pull/298) [`b79c11b`](https://github.com/livepeer/livepeer-react/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added the ability to autoplay videos without forcing mute. This works only in certain conditions where the site is considered "trusted" and the user has interacted with the site - see [Chrome](https://developer.chrome.com/blog/autoplay/) and [Safari](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/) docs for further details on when this is allowed. We recommend testing on your site to ensure that the media will autoplay under the conditions that you expect the user to engage with your content.

- [#295](https://github.com/livepeer/livepeer-react/pull/295) [`3f653f7`](https://github.com/livepeer/livepeer-react/commit/3f653f716ed03b587389cda330541cb30a5f3b4a) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the user agent string to be sanitized before passing to the metrics websocket.

- [#297](https://github.com/livepeer/livepeer-react/pull/297) [`1d34ea4`](https://github.com/livepeer/livepeer-react/commit/1d34ea483e8b5e2bfb01d009e376055deab4fe24) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added IPFS upload on creation of an asset, so no subsequent calls need to be made to upload to IPFS.

- [#298](https://github.com/livepeer/livepeer-react/pull/298) [`b79c11b`](https://github.com/livepeer/livepeer-react/commit/b79c11bb051d85bf47caa98d574eb0b1dff35e0b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** changed the default Player volume level to 1.0, from 0.2. To continue with the previous behavior, use `defaultVolume` in the [controls](https://docs.livepeer.org/reference/livepeer-js/Player#controls) prop.

## 1.3.1

### Patch Changes

- [#293](https://github.com/livepeer/livepeer-react/pull/293) [`8e28a01`](https://github.com/livepeer/livepeer-react/commit/8e28a016fb77059524b9a21cddf9e06df699a749) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `sourceUrl` reporting to the Player.

## 1.3.0

### Minor Changes

- [#289](https://github.com/livepeer/livepeer-react/pull/289) [`20879a4`](https://github.com/livepeer/livepeer-react/commit/20879a4900e277642674f0dada3b7fc78736ea90) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** changed the Player on React and React Native to hide the progress bar when viewing a livestream. Also improved the live stream experience with better HLS.js defaults for lower latency.

### Patch Changes

- [#291](https://github.com/livepeer/livepeer-react/pull/291) [`2c9bb91`](https://github.com/livepeer/livepeer-react/commit/2c9bb91eb9b09a8d113b47368afc3c89ecc2070e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed the styling of the stream error image on small displays (<400px).

- [#289](https://github.com/livepeer/livepeer-react/pull/289) [`20879a4`](https://github.com/livepeer/livepeer-react/commit/20879a4900e277642674f0dada3b7fc78736ea90) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed an error where HLS errors would not provide detail and the Player would throw an `object undefined` error.

## 1.2.3

### Patch Changes

- [#286](https://github.com/livepeer/livepeer-react/pull/286) [`cd502da`](https://github.com/livepeer/livepeer-react/commit/cd502da49908d70ceab241a84a4a670b1a54f701) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** renamed the `protocol` field to `sourceType` to align with the backend metrics websocket.

## 1.2.2

### Patch Changes

- [#284](https://github.com/livepeer/livepeer-react/pull/284) [`620751e`](https://github.com/livepeer/livepeer-react/commit/620751efbf1108ce207e5b83f67e28f9e7dd263e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added better logs for failure on `create` in Studio provider.

## 1.2.1

### Patch Changes

- [#270](https://github.com/livepeer/livepeer-react/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer-react/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `usePlayerList` to use a React ref to avoid dynamic runtime `onViewableItemsChanged` errors.

- [#270](https://github.com/livepeer/livepeer-react/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer-react/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed uploads in React Native environments by removing chunk size for tus.

- [#272](https://github.com/livepeer/livepeer-react/pull/272) [`b11ea90`](https://github.com/livepeer/livepeer-react/commit/b11ea90bb3e488bd6d6661846313849adf389cdf) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `allowCrossOriginCredentials` to the React Player to allow cookies to be sent with playback requests.

- [#270](https://github.com/livepeer/livepeer-react/pull/270) [`68f2e64`](https://github.com/livepeer/livepeer-react/commit/68f2e64241dd6917a638f9d44216531d8b3437e7) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed `getIsVolumeChangeSupported` check to not fail for negative volume values.

## 1.2.0

### Minor Changes

- [#267](https://github.com/livepeer/livepeer-react/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer-react/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added MP4 rendition prioritization to the React and React Native Player.

  This is for support of MP4 renditions returned from `playbackInfo` from the Studio provider. If an MP4 rendition exists for an Asset, it will be prioritized over HLS, since this has been introduced as a performance improvement over HLS for short-form video.

  The MP4 renditions will be chosen with the following algorithm: the device screen width and multiplied by a static multiplier (currently set to x2.5). This value is then compared to the rendition widths, and the renditions are prioritized based on the distance between these values. This results in a choice of a rendition which is close to the screen size without visual quality issues. For instance, a device with a 1280 pixel width would compute `1280px * 2.5 = 3200px`, and then sort the MP4 renditions by which are closest to this value.

### Patch Changes

- [#267](https://github.com/livepeer/livepeer-react/pull/267) [`85e4c05`](https://github.com/livepeer/livepeer-react/commit/85e4c0563802d737bda5d2b76cd36e069da1c61c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** added `pageUrl`, `protocol`, `preloadTime`, and `autoplay` to metrics to track performance of video load under specific conditions.

## 1.1.5

### Patch Changes

- [#265](https://github.com/livepeer/livepeer-react/pull/265) [`318c082`](https://github.com/livepeer/livepeer-react/commit/318c0824a62cffa69c92ba4eb6c45afbb9920958) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** change the metrics reporting port for staging to use 443.

## 1.1.4

### Patch Changes

- [#259](https://github.com/livepeer/livepeer-react/pull/259) [`9568500`](https://github.com/livepeer/livepeer-react/commit/95685009dcb4a2d86b2def2325ade9ddd6d13d1b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added Time to First Frame, Autoplay, and User Agent to metrics reporting. Fixed bugs with play time metrics reporting.

## 1.1.3

### Patch Changes

- [#255](https://github.com/livepeer/livepeer-react/pull/255) [`0e5cbc9`](https://github.com/livepeer/livepeer-react/commit/0e5cbc98116332260178de3aa188db53b9f5f22c) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed Node.js issue with `File` not being defined globally.

## 1.1.2

### Patch Changes

- [`a8a2c58`](https://github.com/livepeer/livepeer-react/commit/a8a2c582da2eb49ef33fca27587129ce1c1bfaa6) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** downgraded packages due to versioning conflicts and upgraded `zustand`.

## 1.1.1

### Patch Changes

- [#248](https://github.com/livepeer/livepeer-react/pull/248) [`5a1c060`](https://github.com/livepeer/livepeer-react/commit/5a1c0606fc3ab1703a74ca02b18acfa93937d684) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed version headers to reference the correct package names.

- [#251](https://github.com/livepeer/livepeer-react/pull/251) [`686fb51`](https://github.com/livepeer/livepeer-react/commit/686fb5178a5746210cc16f1efb77f2c1273f4527) Thanks [@0xcadams](https://github.com/0xcadams)! - **Chore:** updated dependencies to latest versions.

## 1.1.0

### Minor Changes

- [#240](https://github.com/livepeer/livepeer-react/pull/240) [`c4cb597`](https://github.com/livepeer/livepeer-react/commit/c4cb59762a31c865bb8ada9a4176caa614f6be7a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

## 1.0.0

### Major Changes

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

### Minor Changes

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).

### Patch Changes

- [#218](https://github.com/livepeer/livepeer-react/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer-react/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer-react/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer-react/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

- [#213](https://github.com/livepeer/livepeer-react/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer-react/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

## 1.0.0-next.6

### Minor Changes

- [#212](https://github.com/livepeer/livepeer-react/pull/212) [`da28e70`](https://github.com/livepeer/livepeer-react/commit/da28e7037a50e4a3ac3711581cc762f516e5f31a) Thanks [@clacladev](https://github.com/clacladev)! - **Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.

## 1.0.0-next.5

### Patch Changes

- [#218](https://github.com/livepeer/livepeer-react/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer-react/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed regression with slider thumb not showing in correct position, add React Native video customization props, and fixed Player getting stuck in "play" after exit of fullscreen.

- [#218](https://github.com/livepeer/livepeer-react/pull/218) [`07ef48e`](https://github.com/livepeer/livepeer-react/commit/07ef48ea3703bfc9fe715f8583bd91585d63e807) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `priority` boolean to Player to enable lazy loading for content.

## 1.0.0-next.4

### Patch Changes

- [#213](https://github.com/livepeer/livepeer-react/pull/213) [`7f5202d`](https://github.com/livepeer/livepeer-react/commit/7f5202dec42b14dd77546823c8e3c9dd7fe3983b) Thanks [@0xcadams](https://github.com/0xcadams)! - **Fix:** fixed player to display hours correctly and added version headers to API requests for debugging errors.

## 1.0.0-next.3

### Patch Changes

- [#204](https://github.com/livepeer/livepeer-react/pull/204) [`9ce1fa4`](https://github.com/livepeer/livepeer-react/commit/9ce1fa460985d4301c06df88698e7e3e746c4d52) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature**: added native file URI uploading for React Native, default volume config for the Player, and fixed the slider thumb to not extend past the left boundary.

## 1.0.0-next.2

### Patch Changes

- [#195](https://github.com/livepeer/livepeer-react/pull/195) [`e866579`](https://github.com/livepeer/livepeer-react/commit/e86657964e2dd9d141d7d06023207ae88d5c4169) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added `loading` color override to ThemeConfig.

## 1.0.0-next.1

### Patch Changes

- [#187](https://github.com/livepeer/livepeer-react/pull/187) [`44adf29`](https://github.com/livepeer/livepeer-react/commit/44adf2940ae3621038d87f1444b18398a57d399e) Thanks [@0xcadams](https://github.com/0xcadams)! - **Feature:** added further theming overrides to progress and volume sliders.

## 1.0.0-next.0

### Major Changes

- [#182](https://github.com/livepeer/livepeer-react/pull/182) [`16b1307`](https://github.com/livepeer/livepeer-react/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Refactor:** moved the web logic out of `livepeer` into `@livepeer/core` to prevent polyfills from conflicting with React Native.

### Minor Changes

- [#182](https://github.com/livepeer/livepeer-react/pull/182) [`16b1307`](https://github.com/livepeer/livepeer-react/commit/16b1307471bccaf645e623631ca6695ac0218912) Thanks [@0xcadams](https://github.com/0xcadams)! - **Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).
