import { VideoPlayer } from '@livepeer/react';

const playbackId = 'a4e8o6mykgkvtxav';

export function HeaderVideo() {
  return (
    <VideoPlayer
      autoPlay
      loop
      muted
      playbackId={playbackId}
      className="h-30 w-full"
    />
  );
}
