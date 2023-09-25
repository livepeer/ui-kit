import { Player } from '@livepeer/react';

const Page = () => {
  // const [playing, setPlaying] = useState<boolean | null>(null);
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        autoPlay
        muted
        // renderChildrenOutsideContainer
        playbackId="a8a6fftljh8noqgt"
        clipLength={60}
        onClipCreated={(asset) => {
          console.log(asset);
        }}
        // lowLatency="force"
        showPipButton
        // onPlaybackStatusUpdate={(state) => state.se}
        // playbackStatusSelector={(state) => state.playing}
        // onPlaybackStatusUpdate={(playing) => setPlaying(playing)}
      />
      {/* <span>{playing ? 'playing' : 'not playing'}</span> */}
    </>
  );
};

export default Page;
