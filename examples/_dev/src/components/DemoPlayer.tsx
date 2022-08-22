import { VideoPlayer, useAsset } from '@livepeer/react';

const assetId = 'a4e87108-d3b5-4e6b-bb9c-7ca321119cb6';

export const DemoPlayer = () => {
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
    <>Loading...</>
  );
};
