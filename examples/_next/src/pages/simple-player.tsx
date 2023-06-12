import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        // autoPlay
        src="https://lp-playback.com/hls/2d0c5o70uvln4zmu/1920p0.mp4"
      />
    </>
  );
};

export default Page;
