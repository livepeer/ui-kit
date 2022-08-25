import { VideoPlayer } from '@livepeer/react';
import { PlaybackInfo } from 'livepeer';
import { useState } from 'react';

// const assetId = '01c94ad7-35f1-4a55-9802-57c2fa39b964'; // clock
// const assetId = 'a4e87108-d3b5-4e6b-bb9c-7ca321119cb6'; // waterfall
const playbackId = '01c93u43vbi48ojf'; // clock

// TODO: do not merge in production
export const DemoVideo = () => {
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handlePlaybackInfo = (playbackInfo: PlaybackInfo) =>
    setPlaybackUrl(playbackInfo.meta.source[0]?.url);
  const handleError = (error: Error) => setErrorMessage(error.message);

  return (
    <>
      <VideoPlayer
        playbackId={playbackId}
        receivedPlaybackInfo={handlePlaybackInfo}
        receivedError={handleError}
        width="640"
        loop
        muted
      />

      <p>
        PlaybackId: {playbackId}
        <br />
        {errorMessage && (
          <>
            Error: {errorMessage}
            <br />
          </>
        )}
        {playbackUrl && (
          <>
            Playback url: {playbackUrl}
            <br />
          </>
        )}
      </p>
    </>
  );
};
