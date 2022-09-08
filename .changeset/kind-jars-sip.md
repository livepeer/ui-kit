---
'livepeer': patch
'@livepeer/react': patch
---

**Fix:** Improve LivepeerProvider types

Types are now all documented and extensive for the current version of the Studio
API which is the base for the LivepeerProvider interface.

**Feature:** Multistream

The LivepeerProvider now supports the multistream feature. To use it simply add
a `multistream` field with the desired configuration when creating or updating a
`Stream` object.

```typescript
const { mutate: createStream } = useCreateStream();
createStream({
  name,
  multistream: {
    targets: [
      {
        url: 'rtmp://ingest.example.com/rtmp/myStreamKey',
      },
    ],
  },
});
```

**Feature:** Upload progress

Track and show upload progress when creating assets through the `uploadProgress`
field in the `useCreateAsset` hook data.

```typescript
function App() {
  const createAsset = useCreateAsset();
  createAsset.mutate({ name, file });
  return (
    <Text>Upload progress: {100 * createAsset.data?.uploadProgress}%</Text>
  );
}
```
