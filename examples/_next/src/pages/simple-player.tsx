import { Player } from '@livepeer/react';

const Page = () => {
  // const [playing, setPlaying] = useState<boolean | null>(null);
  return (
    <>
      {/* <div style={{ height: '110vh' }} /> */}
      <Player
        autoPlay
        // renderChildrenOutsideContainer
        playbackId="806dk46k6ba0dv3m"
        lowLatency="force"
        streamOfflineErrorComponent={
          <>
            <span style={{ color: 'white' }}>this failed.</span>
          </>
        }
        // onPlaybackStatusUpdate={(state) => state.se}
        // playbackStatusSelector={(state) => state.playing}
        // onPlaybackStatusUpdate={(playing) => setPlaying(playing)}
      />
      {/* <span>{playing ? 'playing' : 'not playing'}</span> */}
    </>
  );
};

export default Page;
