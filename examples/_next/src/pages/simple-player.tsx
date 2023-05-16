import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      <Player
        autoPlay
        priority
        muted
        // src="https://asset-cdn.lp-playback.monster/hls/db0f2grwvfwnildl/1440p0.mp4"
        playbackId="11e6ydrd8k22jm6g"
        loop
      />
    </>
  );
};

export default Page;
