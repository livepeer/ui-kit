import { PlaybackInfo, Player } from '@livepeer/react';
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
      <Player
        playbackId={playbackId}
        onPlaybackInfoUpdated={handlePlaybackInfo}
        onPlaybackInfoError={handleError}
        width={1100}
        loop
        // muted
        containerCss={{ fontFamily: 'Arial' }}
        theme={{
          colors: {
            accent: '#4efffe',
            background: 'black',
            // icon: '#4efffe',
          },
          radii: {
            slider: '3px',
          },
          space: {
            // controlsMarginX: '20px',
            // controlsMarginY: '10px',
          },
          sizes: {
            // trackActive: '8px',
            // trackInactive: '5px',
          },
        }}
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
