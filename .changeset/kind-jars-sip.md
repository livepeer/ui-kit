---
'livepeer': minor
'@livepeer/react': minor
---

**Fix:** Improve LivepeerProvider types

Types are now all documented and extensive for the current version of the Studio
API which is the base for the LivepeerProvider interface.

Storage API has also changed slightly, to allow storing an asset in multiple
different storages in the future. Right now it still only supports IPFS, but the
interface is now compatible with adding more storages in the future.

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

Track and show upload progress when creating assets through the `uploadProgress` field in the `useCreateAsset` hook.

```typescript
function App() {
  const createAsset = useCreateAsset();
  return (
    <Button onClick={() => createAsset.mutate({ name, file })}>Create</Button>
    <Text>Upload progress: {100 * createAsset?.uploadProgress ?? 0}%</Text>
  );
}
```
