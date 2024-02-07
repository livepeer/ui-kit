---
"@livepeer/core-react": patch
"@livepeer/core-web": patch
"@livepeer/react": patch
"@livepeer/core": patch
---

**Feature:** added `Broadcast.StatusIndicator` and moved `LiveIndicator` as a Player-only primitive.

The `LiveIndicator` was not providing an accurate representation of the stream state, and `Broadcast.StatusIndicator` was
added to represent the third possible state, `pending`, which is when the stream is pending negotiation
with the WebRTC WHIP endpoint. `LiveIndicator` is now `Player.LiveIndicator` since this only applies to live/not-live
playback.
