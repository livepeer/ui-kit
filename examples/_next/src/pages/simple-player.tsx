import { Player } from '@livepeer/react';

const Page = () => {
  // const [playing, setPlaying] = useState<boolean | null>(null);
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        // autoPlay
        renderChildrenOutsideContainer
        src="https://lp-playback.com/hls/2d0c5o70usvln4zmu/1920p0.mp4"
        // onPlaybackStatusUpdate={(state) => state.se}
        // playbackStatusSelector={(state) => state.playing}
        // onPlaybackStatusUpdate={(playing) => setPlaying(playing)}
      />
      {/* <span>{playing ? 'playing' : 'not playing'}</span> */}
    </>
  );
};

export default Page;
