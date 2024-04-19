---
"@livepeer/core-react": patch
"@livepeer/core-web": patch
"@livepeer/react": patch
"@livepeer/core": patch
---

**Fix:** fixed an issue where `onError` gets called with `null` in the `addMediaMetrics` plugin, when there is no error.
