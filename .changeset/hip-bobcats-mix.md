---
'@livepeer/react': minor
---

**Fix:** [Next.js 13](https://nextjs.org/blog/next-13) added Server Components, which allows components to be completely rendered on the server. To use `useEffect`/`useState`/browser APIs, any imported components must be marked with the `use client` directive. This makes it easy for users to use the Player and LivepeerConfig in a Server Component.
