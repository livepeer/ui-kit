import { VideoPlayer } from '@livepeer/react';

const playbackId = 'a4e8o6mykgkvtxav';

export const DemoVideoPlayer = () => {
  return <VideoPlayer className="mt-6" playbackId={playbackId} loop muted />;
};
