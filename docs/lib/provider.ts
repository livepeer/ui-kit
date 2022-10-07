import { studioProvider } from '@livepeer/react';

export const provider = studioProvider({
  baseUrl: 'https://livepeer.monster/api',
  apiKey: '3b8d7baf-9c8a-4c17-9b3c-e99560ddc0ca', // process.env.NEXT_PUBLIC_STUDIO_API_KEY,
});
