// TODO: do not merge in production

import { VideoPlayer, useAsset } from '@livepeer/react';
import { useEffect, useState } from 'react';

// const assetId = '01c94ad7-35f1-4a55-9802-57c2fa39b964'; // clock
const assetId = 'a4e87108-d3b5-4e6b-bb9c-7ca321119cb6'; // waterfall

export const AssetDemoPlayer = () => {
  const { data: asset, error } = useAsset(assetId);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => setPlaybackUrl(asset?.playbackUrl), [asset]);
  useEffect(() => setErrorMessage(error?.message), [error]);

  return (
    <>
      {playbackUrl && (
        <VideoPlayer autoPlay loop muted src={playbackUrl} width="640" />
      )}

      <p>
        AssetId: {assetId}
        <br />
        {errorMessage && `Error: ${errorMessage}`}
        <br />
        {playbackUrl && `Playback Url: ${playbackUrl}`}
      </p>
    </>
  );
};
