import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      <Player
        autoPlay
        priority
        muted
        src="https://livepeercdn.monster/hls/11e6ydrd8k22jm6g/index.m3u8"
        // playbackId="11e6ydrd8k22jm6g"
        loop
      />
    </>
  );
};

export default Page;
