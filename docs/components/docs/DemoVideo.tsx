import { useAsset } from '@livepeer/react';

import { VideoPlayer } from '../core';

const assetId = '170c7298-cb5f-4508-9bc0-c29a6810dd1b';

export function DemoVideo() {
  const { data: asset } = useAsset(assetId);

  return asset?.playbackUrl ? (
    <VideoPlayer
      autoPlay
      loop
      muted
      src={asset.playbackUrl}
      className="h-30 w-full"
    />
  ) : (
    <></>
  );
}
