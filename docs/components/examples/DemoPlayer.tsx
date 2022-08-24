import { VideoPlayer } from '@livepeer/react';
import { Asset } from 'livepeer';
import { AssetIdOrString } from 'livepeer/src/types/provider';
import { useState } from 'react';

const assetId: AssetIdOrString = '01c94ad7-35f1-4a55-9802-57c2fa39b964'; // clock
// const assetId: AssetIdOrString = 'a4e87108-d3b5-4e6b-bb9c-7ca321119cb6'; // waterfall

// TODO: do not merge in production
export const DemoPlayer = () => {
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleAsset = (asset: Asset) => setPlaybackUrl(asset.playbackUrl);
  const handleError = (error: Error) => setErrorMessage(error.message);

  return (
    <>
      <VideoPlayer
        assetId={assetId}
        receivedAsset={handleAsset}
        receivedError={handleError}
        width="640"
        loop
        muted
      />

      <p>
        AssetId: {assetId}
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
