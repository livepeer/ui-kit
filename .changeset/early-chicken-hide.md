---
'livepeer': patch
'@livepeer/react': patch
---

Updated the default studio API key to use a new, tracked (and rate-limited) version.

```diff
-export const defaultStudioApiKey = '182188f3-3ddf-4dc2-9889-79ecb17a26c9';
+export const defaultStudioApiKey = '4991930c-f9ae-46a0-a2a8-488c466da778';
```

Updated the types on `CreateAssetArgs` to include `ReadStream` for node.js environments.

```diff
export type CreateAssetArgs = {
  name: string;

- file: File;
+ file: File | ReadStream;
  };
```
