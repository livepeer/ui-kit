import { styled } from '@stitches/react';
import { PlaybackInfo } from 'livepeer';
import * as React from 'react';

import { usePlaybackInfo } from '../../hooks';
import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';
import { VideoControllerContext, useControllerStore } from './context';
import { PlayButton, Progress, SeekBackwardButton } from './controls';

const Container = styled('div', {
  position: 'relative',
});

export type VideoPlayerProps = Omit<
  GenericHlsVideoPlayerProps,
  'src' | 'controls'
> & {
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
  autoPlay = true,
  width = '100%',
  refetchPlaybackInfoInterval = 5000,
  children,
  ...props
}: VideoPlayerProps) {
  const [videoElement, setVideoElement] =
    React.useState<HTMLVideoElement | null>(null);

  const mediaController = useControllerStore(videoElement);

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

  const playerRef = React.useCallback((element: HTMLVideoElement) => {
    if (element) {
      setVideoElement(element);
    }
  }, []);

  return srcOrPlaybackUrl ? (
    <VideoControllerContext.Provider value={mediaController}>
      <Container>
        <HlsVideoPlayer
          hlsConfig={hlsConfig}
          ref={playerRef}
          autoPlay={autoPlay}
          controls={false}
          width={width}
          {...props}
          src={srcOrPlaybackUrl}
        />
        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <PlayButton />
            <SeekBackwardButton />
            <Progress />
          </>
        )}
      </Container>
      {mediaController.progress}
    </VideoControllerContext.Provider>
  ) : null;
}
