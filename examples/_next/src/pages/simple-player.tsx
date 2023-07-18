import { Player } from '@livepeer/react';

const Page = () => {
  // const [playing, setPlaying] = useState<boolean | null>(null);
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        autoPlay
        // renderChildrenOutsideContainer
        playbackId="dbe4u54fx6jc75k2"
        lowLatency="force"
        // onPlaybackStatusUpdate={(state) => state.se}
        // playbackStatusSelector={(state) => state.playing}
        // onPlaybackStatusUpdate={(playing) => setPlaying(playing)}
      />
      {/* <span>{playing ? 'playing' : 'not playing'}</span> */}
    </>
  );
};

export default Page;
