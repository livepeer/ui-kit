'use client';

import { studioProvider } from '@livepeer/react';
import { createClient } from 'livepeer';
import { cache } from 'react';

const { provider } = createClient({
  provider: studioProvider({
    // since this only executes on the server, we can use the PRIVATE_STUDIO_API_KEY,
    // which is a non-CORS enabled API key
    apiKey: process.env.PRIVATE_STUDIO_API_KEY ?? '',
    baseUrl:
      process.env.NEXT_PUBLIC_STUDIO_BASE_URL ?? 'https://livepeer.studio/api',
    ...{ origin: `https://lvpr.tv` },
  }),
});

export const fetchPlaybackInfo = cache(async (playbackId: string) => {
  try {
    const playbackInfo = await provider.getPlaybackInfo({ playbackId });

    return playbackInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
});
