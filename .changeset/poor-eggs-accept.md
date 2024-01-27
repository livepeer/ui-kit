---
"@livepeer/core-react": major
"@livepeer/core-web": major
"@livepeer/react": major
"@livepeer/core": major
"@livepeer/react-native": patch
---

**Major release:** first preview release of the unstyled, composable `<Player />` and `<Broadcast />` primitives based on [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction).

### The motivation

This is a ground-up rewrite of most of the `@livepeer/react` library. In this release, we had some problems we wanted to solve:

1. The `<Player />`/`<Broadcast />` components are not very composable. They essentially break with any type of customization.
2. They encapsulate a lot of application logic (fetching data from the backend, auto-upload, etc) and the Player pushes CORS API keys, which are not a good security practice and cause a lot of developer confusion.
3. The styling is difficult and hard to rework as a developer (and not compatible with Server Components).
4. The react native package is under-maintained and far behind the web player in terms of features/support.

### Our approach

1. Break out the logic of the components to be more composable. Instead of a single `<Player />`, there is now a `<Player.Root />`, `<Player.Container />`, `<Player.Video />`, `<Player.LoadingIndicator />`, `<Player.FullscreenTrigger />`, `<Player.FullscreenIndicator />`, etc. Very similar to Radix, which we use under the hood.
    * This means that instead of one giant component with a lot of logic baked into it, we have a bunch of composable primitives which you can build your apps on top of. We hope you like it!
    * This also brings us much closer to web standards - we don't want to hide the internals from you. You can pass props directly to the video element, like `poster`, and it will "just work" as expected.
    * We still provide a lot of auto-wiring for the components and event listeners - very similar to the previous versions.
2. We removed all API data fetching on the Player (e.g. all of the hooks like `useCreateAsset`), and now provide helpers to use the new [`livepeer`](https://github.com/livepeer/livepeer-js) SDK with the React components.
    * [`getSrc`](https://github.com/livepeer/livepeer-react/blob/f3da0ffd9578932bc9d4e4ce0119cdb90432d84a/packages/core/src/media/external.ts#L18) takes in the response from the playback info endpoint and parses it into something the Player can understand.
    * The only web requests are for pure playback or broadcasting (WHEP/WHIP and metrics reporting) - **there are no more API requests to Livepeer Studio from any components.**
    * This means that you **do not need to configure** a `LivepeerProvider` with an API key. Keep those keys on the backend.
3. The components are now completely unstyled, and the docs will provide examples of how to style them similarly to how they were in the previous releases. You can copy-pasta and then tweak from there.
4. We deprecated the React Native package, for now. It would have been a huge lift to bring it up to feature parity with the React package, and is less straightforward than web to do the WebRTC/HLS fallback and all of the advanced features in the React web package.
    * We want to have first-class support for React Native in the future, but for now, we want to only ship software that we're 100% confident our users will benefit from.

### New features & fixes

* **Composable components** - all components are extremely narrow in their scope, and support the [`asChild` pattern](https://www.radix-ui.com/primitives/docs/guides/composition) popularized by Radix UI. When `asChild` is set to true, we will not render a default DOM element, instead cloning the part's child and passing it the props and behavior required to make it functional.
* **Automatic poster images** - if you pass in the playback info response directly into `getSrc`, it will automatically parse the thumbnail image and pass it into the `poster` for the video.
* **Resume progress on fallback** - now, when an error happens during playback for any reason, we resume playback where it left off.
* **BYOC** - bring your own components. `useMediaContext` is now much easier to use - since the `<Player.Root />` is now just a simple React Context provider, you can build out your own components inside of it which consume the video controller. We have some examples to help avoid the footgunning.

### Callouts

* We are dropping support for `autoUrlUpload` and the fallback to playing directly from IPFS. We understand some users rely on that, and we will work with them to provide docs for how to implement that outside of the player.
* We moved to a new build system which includes `use client` and `use server` directives in the output. If you don't use React Server Components, this doesn't affect you. But this means that you can directly import the client components into a RSC and you don't need to wrap them.
