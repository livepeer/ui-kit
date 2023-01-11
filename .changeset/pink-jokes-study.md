---
'@livepeer/core': minor
'@livepeer/core-react': minor
'livepeer': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
---

**Fix:** added clearer Player error handling instead of an infinite loading spinner. The Player now shows error states for gated streams which do not have a proper JWT and streams which are currently offline.
