---
"@livepeer/core-web": patch
"@livepeer/core": patch
"@livepeer/core-react": patch
"@livepeer/react": patch
---

**Feature:** added `backoff` and `backoffMax` to the Player, which defines the time which the Player waits before attempting, as well as the cap for exponential backoff.

```tsx
/**
 * Controls the initial value for exponential backoff, in ms. Defaults to 500ms, which is subsequently multiplied by 2^n power on each error.
 */
backoff: number;

/**
 * Controls the maximum backoff when an error is encountered, in ms. Defaults to 30s.
 */
backoffMax: number;
```
