---
'@livepeer/core': patch
'@livepeer/core-web': patch
'@livepeer/react': patch
---

**Fix:** fixed the metrics URL to always use the URL for playback. This fixes the edge case where playback and metrics are assigned to different nodes.
