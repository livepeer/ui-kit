import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        // autoPlay
        // src="https://lp-playback.com/hls/2d0c5o70usvln4zmu/1920p0.mp4"
        src="https://lp-playback.com/hls/158351gorw5sze2o0/index.m3u8"
      />
    </>
  );
};

export default Page;
