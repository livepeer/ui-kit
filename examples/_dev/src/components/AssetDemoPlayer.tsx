import { PlaybackInfo, Player, useStream } from '@livepeer/react';
import { useState } from 'react';

// const playbackId = '6d7el73r1y12chxr';
const streamId = '2c61917e-4f05-449a-ab7d-1b3c85f78993';

export const AssetDemoPlayer = () => {
  const { data: stream } = useStream({ streamId });

  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handlePlaybackInfo = (playbackInfo: PlaybackInfo) =>
    setPlaybackUrl(playbackInfo.meta.source[0]?.url);
  const handleError = (error: Error) => setErrorMessage(error.message);

  return (
    <>
      {stream?.playbackId && (
        <Player
          playbackId={stream.playbackId}
          onPlaybackInfoUpdated={handlePlaybackInfo}
          onPlaybackInfoError={handleError}
          loop
          autoPlay
          muted
          theme={{
            fonts: {
              display: 'Inter',
            },
            radii: { containerBorderRadius: '30px' },
            sizes: { containerWidth: '100%' },
            space: {
              controlsTopMarginX: '20px',
              controlsTopMarginY: '15px',
              controlsBottomMarginX: '15px',
              controlsBottomMarginY: '10px',
            },
          }}
        />
      )}

      <p>
        Playback Id: {stream?.playbackId ?? ''}
        <br />
        Stream Key: {stream?.streamKey ?? ''}
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
