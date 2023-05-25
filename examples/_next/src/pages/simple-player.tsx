import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      <Player
        autoPlay
        priority
        muted
        // src="https://asset-cdn.lp-playback.monster/hls/db0f2grwvfwnildl/1440p0.mp4"
        // playbackId="cd15jrkib05jwynb"
        playbackId="487fbr8zsqqclzer"
        loop
        lowLatency
      />
    </>
  );
};

export default Page;
