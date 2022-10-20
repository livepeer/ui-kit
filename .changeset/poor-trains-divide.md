---
'livepeer': minor
'@livepeer/react': minor
---

**Feature:** added picture in picture support to the Livepeer player.

We support both the [w3c](https://w3c.github.io/picture-in-picture/) standard (which most modern browsers support), as well as the [older Safari/iOS
spec](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls).
See the browsers which support Picture-in-Picture on
[caniuse](https://caniuse.com/picture-in-picture).

```tsx
<Player playbackId="6d7el73r1y12chxr" showPipButton />
```
