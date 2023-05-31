---
'@livepeer/core': patch
'@livepeer/core-react': patch
'livepeer': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
---

**Fix:** fixed TTFF bug with the Player reporting an inaccurate TTFF when `priority` was used with a Player which is below the fold. This was happening on the lvpr.tv player, since it is always set to `priority` even though the Player can be below the fold.
