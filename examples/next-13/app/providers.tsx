'use client';

import {
  LivepeerConfig,
  createReactClient,
  createStorage,
  noopStorage,
  studioProvider,
} from '@livepeer/react';
import { useMemo } from 'react';

export const Providers = ({ children }: React.PropsWithChildren) => {
  const livepeerClient = useMemo(
    () =>
      createReactClient({
        storage: createStorage({
          storage: noopStorage,
        }),
        provider: studioProvider({
          apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
        }),
      }),
    [],
  );

  return <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>;
};
