---
'@livepeer/react': minor
---

**Fix:** moved all contract interactions to a separate subpackage, to remove the need for the `ethers`/`wagmi` peer dependencies.

```diff
+import {
+  useBondingManager,
+  useController,
+  useL1Migrator,
+  useL2Migrator,
+  useLivepeerToken,
+  useLivepeerTokenFaucet,
+  useMerkleSnapshot,
+  useMinter,
+  usePollCreator,
+  useRoundsManager,
+  useServiceRegistry,
+  useTicketBroker,
+} from '@livepeer/react/contracts';
```
