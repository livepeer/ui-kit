---
'@livepeer/core': minor
'@livepeer/core-react': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
'livepeer': minor
---

**Feature:** added `accessKey` and `onAccessKeyRequest` props to the Player, to support the `webhook` playback policy which allows users to play back streams/assets with webhook authentication. The access key is appended to the query string in the source URL of the video, and this access key is passed along to a user-defined webhook which validates the payload to make sure the user has access to the content.
