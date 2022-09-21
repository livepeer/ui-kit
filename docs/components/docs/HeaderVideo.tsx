import { Player } from '@livepeer/react';
import * as React from 'react';

const playbackId = 'a4e8o6mykgkvtxav';

export function HeaderVideo() {
  return (
    <Player
      autoPlay
      loop
      muted
      playbackId={playbackId}
      className="h-30 w-full"
      containerCss={{ fontFamily: 'inherit' }}
    />
  );
}
