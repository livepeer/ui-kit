import { VideoPlayer, useAsset } from '@livepeer/react';
import { useEffect, useState } from 'react';

const assetId = '01c94ad7-35f1-4a55-9802-57c2fa39b964';

export const AssetDemoPlayer = () => {
  const { data: asset } = useAsset(assetId);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);

  useEffect(() => setPlaybackUrl(asset?.playbackUrl), [asset]);

  return (
    <>
      {playbackUrl ? (
        <VideoPlayer autoPlay loop muted src={playbackUrl} width="640" />
      ) : (
        <>Loading...</>
      )}
      <p>
        AssetId: {assetId}
        <br />
        PlaybackUrl: {playbackUrl ?? 'loading...'}
      </p>
    </>
  );
};
