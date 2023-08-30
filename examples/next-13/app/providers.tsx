'use client';

import {
  LivepeerConfig,
  createReactClient,
  createStorage,
  noopStorage,
  studioProvider,
} from '@livepeer/react';
import { useMemo } from 'react';

function fromStorage(key: string): string | null {
  let apiOverride: string | null = null;
  try {
    apiOverride = localStorage.getItem(key);
  } catch (e) {
    // No problem. Default behavior.
  }
  return apiOverride;
}

export const Providers = ({ children }: React.PropsWithChildren) => {
  const livepeerClient = useMemo(
    () =>
      createReactClient({
        storage: createStorage({
          storage: noopStorage,
        }),
        provider: studioProvider({
          apiKey:
            fromStorage('STUDIO_API_KEY') ??
            process.env.NEXT_PUBLIC_STUDIO_API_KEY ??
            '',
          baseUrl:
            fromStorage('STUDIO_BASE_URL') ??
            process.env.NEXT_PUBLIC_STUDIO_BASE_URL ??
            'https://livepeer.studio/api',
          webrtcIngestBaseUrl:
            fromStorage('WEBRTC_INGEST_BASE_URL') ??
            process.env.NEXT_PUBLIC_WEBRTC_INGEST_BASE_URL ??
            'https://webrtc.livepeer.studio/webrtc',
          ...{ origin: `https://lvpr.tv` },
        }),
      }),
    [],
  );

  return <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>;
};
