---
'@livepeer/core': patch
'@livepeer/core-react': patch
'livepeer': patch
'@livepeer/react': patch
'@livepeer/react-native': patch
---

**Fix:** changed the default Player volume level to 1.0, from 0.2. To continue with the previous behavior, use `defaultVolume` in the [controls](https://docs.livepeer.org/reference/livepeer-js/Player#controls) prop.
