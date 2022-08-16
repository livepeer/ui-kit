import { LivepeerConfig, createReactClient } from '@livepeer/react';
import { studioProvider } from 'livepeer/providers/studio';
import * as React from 'react';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

type Props = {
  children?: React.ReactNode;
};

export function Providers({ children }: Props) {
  return <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>;
}
