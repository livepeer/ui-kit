---
'livepeer': minor
'@livepeer/react': minor
---

**Feature:** added JWT handling in Player, with `livepeer/crypto` subpackage with JWT helpers for NodeJS access control on Assets and Streams.

The Player has a new prop, `jwt`, which takes a base64Url-encoded signed JWT payload and passes it as a query parameter with the stream playlist request. The livepeer provider will evaluate the JWT and determine if it is valid, before returning a response.

_Note: this currently only works for Streams! Assets will be supported in the future._

```diff
+ import { importPKCS8, signAccessJwt, type SignAccessJwtOptions } from 'livepeer';
```

```tsx
<Player
  title="Agent 327: Operation Barbershop"
  playbackId="6d7el73r1y12chxr"
  jwt={jwt}
/>
```
