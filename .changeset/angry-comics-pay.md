---
'livepeer': minor
---

**Feature:** Asset Metrics

There is now support for asset metrics, with start views count being returned
when metrics have been reported to the correct reporting URL (this is handled in
`@livepeer/react`'s `VideoPlayer`).

```typescript
const metrics = getAssetMetrics({ assetId });

const viewCount = metrics?.metrics?.[0]?.startViews ?? 0;
```
