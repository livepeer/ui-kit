import { PlaybackInfo } from 'livepeer';
import * as React from 'react';

import { usePlaybackInfo } from '../hooks';

import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';

export type VideoPlayerProps = Omit<GenericHlsVideoPlayerProps, 'src'> & {
  /** The source of the video (required if `playbackId` is not provided) */
  src?: string;
  /** The playback ID for the video (required if `src` is not provided) */
  playbackId?: string;

  /** The refetch interval for the playback info hook (used to query until there is a valid playback URL) */
  refetchPlaybackInfoInterval?: number;
  /** Callback for when the playback info is successfully updated */
  onPlaybackInfoUpdated?: (playbackInfo: PlaybackInfo) => void;
  /** Callback for when the playback info request fails */
  onPlaybackInfoError?: (error: Error) => void;
} & (
    | {
        src: string;
      }
    | {
        playbackId: string;
      }
  );

export function VideoPlayer({
  src,
  playbackId,
  onPlaybackInfoUpdated,
  onPlaybackInfoError,
  hlsConfig,
  playerRef = React.createRef<HTMLVideoElement>(),
  autoPlay = true,
  controls = true,
  width = '100%',
  refetchPlaybackInfoInterval = 5000,
  ...props
}: VideoPlayerProps) {
  const { data: playbackInfo, error: playbackInfoError } = usePlaybackInfo({
    playbackId,
    refetchInterval: (info) => (info ? false : refetchPlaybackInfoInterval),
    enabled: src ? false : undefined,
  });
  const [playbackUrl, setPlaybackUrl] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (playbackInfo) {
      const url = playbackInfo?.meta?.source?.[0]?.url;
      if (url) {
        setPlaybackUrl(url);
      }

      onPlaybackInfoUpdated?.(playbackInfo);
    }
  }, [playbackInfo, onPlaybackInfoUpdated]);

  React.useEffect(() => {
    if (playbackInfoError) {
      console.error(playbackInfoError);

      onPlaybackInfoError?.(playbackInfoError);
    }
  }, [playbackInfoError, onPlaybackInfoError]);

  const srcOrPlaybackUrl = React.useMemo(
    () => playbackUrl || src,
    [playbackUrl, src],
  );

  return srcOrPlaybackUrl ? (
    <HlsVideoPlayer
      hlsConfig={hlsConfig}
      playerRef={playerRef}
      autoPlay={autoPlay}
      controls={controls}
      width={width}
      {...props}
      src={srcOrPlaybackUrl}
    />
  ) : null;
}
