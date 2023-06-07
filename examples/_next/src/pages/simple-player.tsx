import { Player } from '@livepeer/react';

const Page = () => {
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        autoPlay
        // priority
        muted
        playbackId="2c98ea3a200be258"
        loop
        lowLatency
      />
    </>
  );
};

export default Page;
