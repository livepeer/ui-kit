import { VideoPlayer } from '@livepeer/react';
import * as React from 'react';

const playbackId = 'a4e8o6mykgkvtxav';

export function HeaderVideo() {
  return (
    <VideoPlayer
      autoPlay
      loop
      muted
      playbackId={playbackId}
      className="h-30 w-full"
      containerCss={{ fontFamily: 'inherit' }}
    />
  );
}
