---
'@livepeer/core': minor
'@livepeer/core-react': minor
'livepeer': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
---

**Feature:** Added WebRTC playback for the web Player, which uses the new endpoint from the Studio provider to play back WebRTC livestreams, if they are available. If these do not succeed in playing back, the Player will automatically fall back to HLS playback. Also, if the stream contains "bframes" (which are common for users streaming with OBS or other streaming providers), the Player will automatically fall back.
