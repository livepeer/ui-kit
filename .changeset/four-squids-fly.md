---
'@livepeer/core': patch
'@livepeer/core-react': patch
'@livepeer/react': patch
'livepeer': patch
---

**Fix:** updated the metrics to send the `pageUrl` as the `document.referrer` when used in an iFrame context, to be able to attribute metrics to a page which uses an iFrame.
