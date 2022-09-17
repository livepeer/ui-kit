import { ControlsOptions, PlaybackInfo } from 'livepeer';
import * as React from 'react';

import { usePlaybackInfo } from '../../../hooks';
import { PropsOf } from '../../system';
import { MediaControllerProvider } from '../context';

import {
  BottomContainer,
  Container,
  FullscreenButton,
  PlayButton,
  Progress,
  TimeDisplay,
  Volume,
} from '../controls';
import { GenericHlsVideoPlayerProps, HlsVideoPlayer } from './HlsVideoPlayer';

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

  /** Configuration for the event listeners */
  controlsConfig?: ControlsOptions;
  /** CSS for the container element */
  containerCss?: PropsOf<typeof Container>['css'];
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
  controlsConfig,
  containerCss,
  ...props
}: VideoPlayerProps) {
  const [videoElement, setVideoElement] =
    React.useState<HTMLVideoElement | null>(null);

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

  const playerRef = React.useCallback(
    (element: HTMLVideoElement) => {
      if (element && !videoElement) {
        setVideoElement(element);
      }
    },
    [videoElement],
  );

  return srcOrPlaybackUrl ? (
    <MediaControllerProvider element={videoElement} options={controlsConfig}>
      <Container css={{ width, ...containerCss }}>
        <HlsVideoPlayer
          hlsConfig={hlsConfig}
          ref={playerRef}
          autoPlay={autoPlay}
          controls={false}
          {...props}
          src={srcOrPlaybackUrl}
        />

        {React.isValidElement(children) ? (
          children
        ) : (
          <BottomContainer
            topControls={<Progress />}
            leftControls={
              <>
                <PlayButton />
                <Volume />
                <TimeDisplay />
              </>
            }
            rightControls={<FullscreenButton />}
          />
        )}
      </Container>
    </MediaControllerProvider>
  ) : null;
}
