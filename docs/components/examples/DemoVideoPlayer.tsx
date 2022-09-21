import { Player } from '@livepeer/react';
import * as React from 'react';

const playbackId = 'a4e8o6mykgkvtxav';

export const DemoVideoPlayer = () => {
  return (
    <Player
      playbackId={playbackId}
      loop
      containerCss={{ marginTop: '$5', fontFamily: 'inherit' }}
    />
  );
};
