---
'livepeer': patch
'@livepeer/react': patch
---

Allow configuring base URL of Livepeer Studio provider

You can now configure more parameters of the the Livepeer Studio provider,
including specifically the `baseUrl` for the API calls.

```ts
const livepeer = createReactClient({
  provider: studioProvider({
    baseUrl: 'https://studio.my-domain.com/root/api',
    apiKey: '123-abcd',
  }),
});
```
