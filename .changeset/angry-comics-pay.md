---
'livepeer': minor
---

**Feature:** Asset Metrics

There is now support for asset metrics, with total view count being returned
when metrics have been reported to the correct reporting URL (this is handled in
`@livepeer/react`'s `VideoPlayer`).

```typescript
const metrics = getMetrics({ assetId });

const viewCount = metrics?.[0]?.startViews ?? 0;
```
