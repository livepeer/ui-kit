---
'livepeer': patch
'@livepeer/react': patch
---

**Feature:** Added automatic fetching/importing of IPFS URLs to the Player.

An IPFS [v0 or v1 CID](https://docs.ipfs.tech/concepts/content-addressing/) or URL (such as `ipfs://<CID>`, `https://<CID>.ipfs.dweb.link/` or `https://cloudflare-ipfs.com/ipfs/<CID>`, _but cannot be a directory_) can be passed as the `src` or `playbackID` to the Player, and it will automatically detect if it is a valid CID and attempt to fetch the playback info for the CID. If the API does not have an Asset with the corresponding CID, the Player will automatically attempt to import the CID from IPFS, and then play the transcoded content back.
