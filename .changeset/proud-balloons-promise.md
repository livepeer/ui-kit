---
'@livepeer/react': patch
---

**Breaking:** removed the term "LPMS" from the library and replaced a "LPMS Provider" with a "Livepeer Provider".

See below for the API changes:

```diff
- const lpmsProvider = useLPMSProvider<TLPMSProvider>();
+ const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();
```

```diff
- import { StudioLPMSProvider, studioProvider } from 'livepeer/providers/studio';
+ import {
+   StudioLivepeerProvider,
+   studioProvider,
+ } from 'livepeer/providers/studio';
```
