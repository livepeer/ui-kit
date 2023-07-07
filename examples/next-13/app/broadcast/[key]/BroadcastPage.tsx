'use client';

import { Broadcast, BroadcastProps } from '@livepeer/react';
import { useEffect } from 'react';

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

export default (props: BroadcastProps<any>) => {
  useEffect(() => {
    if (!isIframe()) {
      document.body.style.backgroundColor = 'black';
    }
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
      <Broadcast
        {...props}
        theme={{
          radii: {
            containerBorderRadius: '0px',
          },
        }}
      />
    </div>
  );
};
