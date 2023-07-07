import { Broadcast, MediaControllerCallbackState } from '@livepeer/react';
import { useCallback, useState } from 'react';

const broadcastSelector = ({ muted }: MediaControllerCallbackState) => ({
  muted,
});

const Page = () => {
  const [muted, setMuted] = useState(false);

  const onPlaybackStatusUpdate = useCallback(
    (slice: ReturnType<typeof broadcastSelector>) => {
      setMuted(slice.muted);
    },
    [],
  );

  return (
    <>
      <Broadcast
        streamKey="2c98-0rlv-020s-wcus"
        playbackStatusSelector={broadcastSelector}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      <span>{muted ? 'muted' : 'not muted'}</span>
    </>
  );
};

export default Page;
