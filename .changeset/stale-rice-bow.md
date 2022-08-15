---
'@livepeer/react': minor
---

The `@livepeer/react` package is now comprised of three main groups:

- **client:** the React-specific LPMS provider wrapped with `react-query` for query caching/persistence to storage
- **context:** React Context for providing the client to React hooks
- **hooks:** functions to write/read from Livepeer Media Server (LPMS) providers and the Livepeer protocol smart contracts

### Client

```diff
+ import { createReactClient } from '@livepeer/react';
+ import type { CreateReactClientConfig } from '@livepeer/react';
```

### Context

```diff
+ import { Context, LivepeerConfig, useClient } from '@livepeer/react';
+ import type { LivepeerConfigProps } from '@livepeer/react';
```

### Hooks

```diff
+ import {
+   useAsset,
+   useBondingManager,
+   useController,
+   useCreateAsset,
+   useCreateStream,
+   useL1Migrator,
+   useL2Migrator,
+   useLivepeerToken,
+   useLivepeerTokenFaucet,
+   useLPMSProvider,
+   useMerkleSnapshot,
+   useMinter,
+   usePollCreator,
+   useRoundsManager,
+   useServiceRegistry,
+   useStream,
+   useStreamSession,
+   useStreamSessions,
+   useTicketBroker,
+   useUpdateAsset,
+   useUpdateStream,
+ } from '@livepeer/react';
```
