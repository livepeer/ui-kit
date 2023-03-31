'use client';

import { Player, PlayerProps } from '@livepeer/react';
import mux from 'mux-embed';
import { useCallback, useEffect } from 'react';

function isIframe() {
  try {
    return window.self !== window.top;
  } catch {
    // do nothing here
  }
  try {
    return window.self !== window.parent;
  } catch {
    // do nothing here
  }
  // default to true as this is only used to set a transparent background
  return true;
}

export default (props: PlayerProps<object>) => {
  useEffect(() => {
    if (!isIframe()) {
      document.body.style.backgroundColor = 'black';
    }
  }, []);

  const mediaElementRef = useCallback((element: HTMLMediaElement) => {
    mux.monitor(element, {
      debug: false,
      data: {
        env_key: '8oj27fenun6v4ffvrgn6ehc7m',
        player_name: 'Livepeer.TV Player v2',
        player_env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
      },
    });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Player
        {...props}
        src={props?.src}
        showPipButton
        priority
        theme={{
          radii: {
            containerBorderRadius: '0px',
          },
        }}
        controls={{
          defaultVolume: 0.7,
        }}
        mediaElementRef={mediaElementRef}
      />
    </div>
  );
};
