import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        // autoPlay
        // priority
        muted
        // src="https://asset-cdn.lp-playback.monster/hls/db0f2grwvfwnildl/1440p0.mp4"
        playbackId="d277t8pq2ez43heb"
        loop
        lowLatency
      />
    </>
  );
};

export default Page;
