---
'@livepeer/react': minor
---

**Feature:** added prefetch to all React hooks.

The new functions include: `prefetchAsset`, `prefetchAssetMetrics`, `prefetchPlaybackInfo`, `prefetchStream`, `prefetchStreamSession`, `prefetchStreamSessions`, which provide prefetching using React Query. Also added `prefetchPlayer`, which wraps `prefetchPlaybackInfo` to make it easier to use the prefetch hooks with the Player.
