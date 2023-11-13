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
        playbackId="9df76sqekj764s7k"
        webrtcConfig={{
          constant: true,
        }}
        clipLength={60}
        onClipCreated={(asset) => {
          console.log(asset);
        }}
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
