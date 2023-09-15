---
'@livepeer/core-react': patch
'@livepeer/react': patch
'@livepeer/core': patch
'livepeer': patch
'@livepeer/react-native': patch
---

**Feature:** added custom components to render in place of the default error components, for when a stream is offline: `streamOfflineErrorComponent`, when an access control error occurs (like an invalid JWT is passed): `accessControlErrorComponent`, and when playback fails another unknown error: `playbackFailedErrorComponent`.

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
