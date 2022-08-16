---
'livepeer': patch
---

**Breaking:** removed the term "LPMS" from the library and replaced a "LPMS Provider" with a "Livepeer Provider".

See below for the API changes:

```diff
import {
  getL2Migrator,
  getLivepeerToken,
  getLivepeerTokenFaucet,
- getLPMSProvider,
+ getLivepeerProvider,
  getMerkleSnapshot,
  getMinter,
  ...
  updateAsset,
  updateStream,
- watchLPMSProvider,
+ watchLivepeerProvider,
  ...
- GetLPMSProviderResult,
- WatchLPMSProviderCallback,
+ GetLivepeerProviderResult,
+ WatchLivepeerProviderCallback,
  ...
  allChainId,
- allLPMS,
  arbitrumOneAddress,
  arbitrumRinkebyAddress,
  ArbRetryableTxABI,
  BondingManagerABI,
  ControllerABI,
- defaultLPMS,
+ defaultStudioApiKey,
  defaultTranscodingProfiles,
  InboxABI,
  L1BondingManagerABI,
  ...
  L2MigratorABI,
  LivepeerTokenABI,
  LivepeerTokenFaucetABI,
+ lpms,
  mainnetAddress,
  mainnetChainId,
  MerkleSnapshotABI,
  ...
  LivepeerAddress,
  LivepeerChain,
  LivepeerChainId,
- LPMSName,
+ LivepeerProviderName,
  MainnetLivepeerChain,
  MainnetLivepeerChainId,
  TestnetLivepeerChain,
  ...
  L1Migrator,
  L2LPTGateway,
  L2Migrator,
+ LivepeerProvider,
+ LivepeerProviderConfig,
  LivepeerToken,
  LivepeerTokenFaucet,
- LPMS,
- LPMSProvider,
  MerkleSnapshot,
  Minter,
  ...
} from "livepeer";
```
