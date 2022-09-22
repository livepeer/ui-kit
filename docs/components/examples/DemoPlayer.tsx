import { Player } from '@livepeer/react';
import * as React from 'react';

const playbackId = '6d7el73r1y12chxr'; // 'a4e8o6mykgkvtxav';

export const DemoPlayer = () => {
  return (
    <Player
      title="Agent 327: Operation Barbershop"
      playbackId={playbackId}
      autoPlay
      muted
      controls={{
        hotkeys: true,
        autohide: 1000,
      }}
      theme={{
        radii: { containerBorderRadius: '30px' },
        sizes: { containerWidth: '600px' },
        space: {
          controlsTopMarginX: '20px',
          controlsTopMarginY: '15px',
          controlsBottomMarginX: '15px',
          controlsBottomMarginY: '10px',
        },
      }}
    />
  );
};
