# @livepeer/react

## 0.2.0

### Minor Changes

- [#1](https://github.com/livepeer/livepeer.js/pull/1) [`6a8c1f5`](https://github.com/livepeer/livepeer.js/commit/6a8c1f59065533bbdb10bd73abca91e519370393) Thanks [@0xcadams](https://github.com/0xcadams)! - The `@livepeer/react` package is now comprised of three main groups:

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

### Patch Changes

- Updated dependencies [[`ebd1587`](https://github.com/livepeer/livepeer.js/commit/ebd15872cf7ac48a092ad88ea3a470a1c788e223)]:
  - livepeer@0.2.0
