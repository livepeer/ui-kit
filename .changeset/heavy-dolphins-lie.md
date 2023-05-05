---
'@livepeer/core': patch
'@livepeer/core-react': patch
'livepeer': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
---

**Feature:** added creator ID to create asset, so users can provide either a string (which is an unverified address) or an object with a `type`. We currently only support `unverified` types, which means that passing a verified signature to verify the address is not yet possible.

```tsx
type CreateAssetCreatorId =
  | {
      /**
       * The `type` of the identifier - unverified means that the value is not signed, and is an address
       * that is blindly trusted.
       */
      type: 'unverified';
      /**
       * Developer-managed ID of the user who created the asset.
       */
      value: string;
    }
  | string;
```
