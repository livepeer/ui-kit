import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

import { ReactNode } from 'react';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

type Props = {
  children?: ReactNode;
};

const livepeerTheme: ThemeConfig = {
  borderStyles: {
    containerBorderStyle: 'solid',
  },
  borderWidths: {
    loadingWidth: '1px',
  },
  colors: {
    accent: 'rgb(0, 145, 255)',
    containerBorderColor: 'rgba(0, 145, 255, 0.3)',
  },
  fonts: {
    display: 'Inter',
  },
  fontWeights: {
    titleFontWeight: 800,
  },
  sizes: {
    containerBorderWidth: '1px',
    loading: '80px',
    trackActive: '6px',
    trackInactive: '3px',
  },
  radii: {
    containerBorderRadius: '10px',
    slider: '4px',
  },
};

export function Providers({ children }: Props) {
  return (
    <LivepeerConfig client={livepeerClient} theme={livepeerTheme}>
      {children}
    </LivepeerConfig>
  );
}
