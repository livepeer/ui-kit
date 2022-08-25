import { Asset, AssetIdOrString } from 'livepeer/src/types/provider';
import React, { createRef, useEffect, useState } from 'react';

import { useAsset } from '../hooks';
import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';

export interface VideoPlayerProps extends GenericHlsVideoPlayerProps {
  assetId: AssetIdOrString;
  receivedAsset?: (asset: Asset) => void;
  receivedError?: (error: Error) => void;
}

export function VideoPlayer({
  hlsConfig,
  playerRef = createRef<HTMLVideoElement>(),
  assetId,
  receivedAsset,
  receivedError,
  autoPlay = true,
  controls = true,
  width = '100%',
  ...props
}: VideoPlayerProps) {
  const { data: asset, error } = useAsset(assetId);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!asset) return;
    setPlaybackUrl(asset.playbackUrl);
    receivedAsset && receivedAsset(asset);
  }, [asset]);

  useEffect(() => {
    if (!error) return;
    console.error(error);
    receivedError && receivedError(error);
  }, [error]);

  if (!playbackUrl) return <></>;

  return (
    <HlsVideoPlayer
      hlsConfig={hlsConfig}
      playerRef={playerRef}
      src={playbackUrl}
      autoPlay={autoPlay}
      controls={controls}
      width={width}
      {...props}
    />
  );
}
