---
"@livepeer/core-web": patch
"@livepeer/core": patch
"@livepeer/core-react": patch
"@livepeer/react": patch
---

**Fix:** changed `getUserMedia` to override to request video when both audio and video are disabled, so that the Broadcast doesn't get stuck in a pending state.
