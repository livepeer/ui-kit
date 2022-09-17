import { VideoPlayer } from '@livepeer/react';
import { PlaybackInfo } from 'livepeer';
import { useState } from 'react';

const playbackId = '6d7el73r1y12chxr';

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
        width={1100}
        loop
        // muted
        containerCss={{ fontFamily: 'Arial' }}
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
