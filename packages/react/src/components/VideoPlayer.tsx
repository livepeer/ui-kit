import { PlaybackInfo } from 'livepeer/src/types/provider';
import React, { useEffect, useState } from 'react';

import { usePlaybackInfo } from '../hooks/playback/usePlaybackInfo';
import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';

export interface VideoPlayerProps extends GenericHlsVideoPlayerProps {
  playbackId: string;
  receivedPlaybackInfo?: (playbackInfo: PlaybackInfo) => void;
  receivedError?: (error: Error) => void;
}

export function VideoPlayer({
  playbackId,
  receivedPlaybackInfo,
  receivedError,
  hlsConfig,
  playerRef = React.createRef<HTMLVideoElement>(),
  autoPlay = true,
  controls = true,
  width = '100%',
  ...props
}: VideoPlayerProps) {
  const { data: playbackInfo, error } = usePlaybackInfo(playbackId);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!playbackInfo) return;
    const url = playbackInfo?.meta.source[0]?.url;
    if (url) {
      setPlaybackUrl(url);
    }
    if (playbackInfo) {
      receivedPlaybackInfo && receivedPlaybackInfo(playbackInfo);
    }
  }, [playbackInfo]);

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
