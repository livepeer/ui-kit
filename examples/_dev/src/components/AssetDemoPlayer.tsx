import { PlaybackInfo, VideoPlayer } from '@livepeer/react';
import { useState } from 'react';

const playbackId = 'ca5df1nsuezgxu8q'; // clock

export const AssetDemoPlayer = () => {
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
        onPlaybackInfoUpdated={handlePlaybackInfo}
        onPlaybackInfoError={handleError}
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
