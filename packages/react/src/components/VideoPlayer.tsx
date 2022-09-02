import { PlaybackInfo } from 'livepeer/src/types/provider';
import { createRef, useEffect, useState } from 'react';

import { usePlaybackInfo } from '../hooks/playback/usePlaybackInfo';
import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';

export interface VideoPlayerProps extends GenericHlsVideoPlayerProps {
  playbackId: string;
  autoplay: boolean;
  onPlaybackInfoUpdated?: (playbackInfo: PlaybackInfo) => void;
  onPlaybackInfoError?: (error: Error) => void;
}

export function VideoPlayer({
  playbackId,
  onPlaybackInfoUpdated,
  onPlaybackInfoError,
  hlsConfig,
  playerRef = createRef<HTMLVideoElement>(),
  autoplay = true,
  controls = true,
  width = '100%',
  ...props
}: VideoPlayerProps) {
  const { data: playbackInfo, error: playbackInfoError } =
    usePlaybackInfo(playbackId);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (playbackInfo) {
      const url = playbackInfo?.meta?.source?.[0]?.url;
      if (url) {
        setPlaybackUrl(url);
      }

      onPlaybackInfoUpdated?.(playbackInfo);
    }
  }, [playbackInfo, onPlaybackInfoUpdated]);

  useEffect(() => {
    if (playbackInfoError) {
      console.error(playbackInfoError);

      onPlaybackInfoError?.(playbackInfoError);
    }
  }, [playbackInfoError, onPlaybackInfoError]);

  if (!playbackUrl) {
    return <></>;
  }

  return (
    <HlsVideoPlayer
      hlsConfig={hlsConfig}
      playerRef={playerRef}
      src={playbackUrl}
      autoplay={autoplay}
      controls={controls}
      width={width}
      {...props}
    />
  );
}
