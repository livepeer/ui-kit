---
'@livepeer/react': minor
---

**Feature:** Asset Metrics (`useAssetMetrics`)

`useAssetMetrics` hook has been added for fetching asset metrics. This hook will update
when viewership metrics have been reported to the correct reporting URL (this is handled in
`@livepeer/react`'s `VideoPlayer`).

```typescript
const { data: metrics } = useAssetMetrics({
  assetId: createdAsset?.id,
  refetchInterval: (metrics) => (!metrics ? 30000 : false),
});

const viewCount = metrics?.metrics?.[0]?.startViews ?? 0;
```
