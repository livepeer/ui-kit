import { defaultStudioConfig, studioProvider } from '@livepeer/react';

export const provider = studioProvider({
  apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  baseUrl:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'https://livepeer.monster/api'
      : defaultStudioConfig.baseUrl,
});
