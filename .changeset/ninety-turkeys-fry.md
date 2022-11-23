---
'@livepeer/react': patch
---

**Feature**: added fallback to play directly from IPFS in the Player.

```tsx
export type PlayerProps = {
  ...
  autoUrlUpload?:
    | boolean
    | { fallback: true; ipfsGateway?: string; arweaveGateway?: string };
  ...
};
```
