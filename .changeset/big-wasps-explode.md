---
"@livepeer/core-web": patch
"@livepeer/react": patch
"@livepeer/core": patch
"@livepeer/core-react": patch
---

**Fix:** fixed the interface for broadcasting (and player) to be vendor agnostic. This now uses `getIngest` similar to the `getSrc` for Player, which attempts to parse out a WHIP ingest URL.
This has been tested against Cloudflare's WHIP/WHEP offering.
