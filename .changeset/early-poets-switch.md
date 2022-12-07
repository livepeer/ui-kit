---
'@livepeer/core': minor
'@livepeer/core-react': minor
'livepeer': minor
'@livepeer/react': minor
'@livepeer/react-native': minor
---

**Breaking:** removed the peer dependency on `ethers` and `typechain` in favor of exporting const ABIs which can be used with tools like [abitype](https://github.com/wagmi-dev/abitype).
