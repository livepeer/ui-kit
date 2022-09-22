import { ControlsOptions, PlaybackInfo, ThemeConfig } from 'livepeer';
import * as React from 'react';

import { usePlaybackInfo } from '../../hooks';
import { GenericHlsPlayerProps, HlsPlayer } from './HlsPlayer';
import { MediaControllerProvider, useTheme } from './context';

import {
  Container,
  ControlsContainer,
  FullscreenButton,
  PlayButton,
  Poster,
  Progress,
  TimeDisplay,
  Volume,
} from './controls';
import { Title } from './controls/Title';

export type PlayerProps = Partial<
  Pick<GenericHlsPlayerProps, 'hlsConfig' | 'loop'>
> & {
  /** The source of the media (required if `playbackId` is not provided) */
  src?: string;
  /** The playback ID for the media (required if `src` is not provided) */
  playbackId?: string;

  /** The title of the media */
  title?: string;
  /** Shows/hides the title at the top of the video */
  showTitle?: boolean;

  /** Poster image to show when the content is either loading (when autoplaying) or hasn't started yet (without autoplay).
   * It is highly recommended to also pass in a `title` attribute as well, for ARIA compatibility. */
  poster?: string | React.ReactNode;
  /** Shows/hides the loading spinner */
  showLoadingSpinner?: boolean;

  /** Configuration for the event listeners */
  controls?: ControlsOptions;
  /** Play media automatically when the content loads (if this is specified, you must also specify muted, since this is required in browsers) */
  autoPlay?: boolean;
  /** Mute media by default */
  muted?: boolean;

  /** Theme configuration for the player */
  theme?: ThemeConfig;

  /** Custom controls passed in to override the default controls */
  children?: React.ReactNode;

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
  ) &
  (
    | {
        autoPlay: true;
        muted: true;
      }
    | {
        autoPlay?: false;
        muted?: boolean;
      }
  );

export function Player({
  autoPlay,
  children,
  controls,
  hlsConfig,
  muted = true,
  onPlaybackInfoError,
  onPlaybackInfoUpdated,
  playbackId,
  refetchPlaybackInfoInterval = 5000,
  src,
  theme,
  title,
  poster,
  loop,
  showLoadingSpinner = true,
  showTitle = true,
}: PlayerProps) {
  const [mediaElement, setMediaElement] =
    React.useState<HTMLMediaElement | null>(null);

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
      if (element && !mediaElement) {
        setMediaElement(element);
      }
    },
    [mediaElement],
  );

  const contextTheme = useTheme(theme);

  return srcOrPlaybackUrl ? (
    <MediaControllerProvider element={mediaElement} options={controls}>
      <Container className={contextTheme}>
        <HlsPlayer
          hlsConfig={hlsConfig}
          ref={playerRef}
          autoPlay={autoPlay}
          muted={autoPlay ? true : muted}
          src={srcOrPlaybackUrl}
          poster={typeof poster === 'string' ? poster : undefined}
          loop={loop}
        />

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              showLoadingSpinner={showLoadingSpinner}
              poster={poster && <Poster content={poster} title={title} />}
              top={<>{title && showTitle && <Title content={title} />}</>}
              middle={<Progress />}
              left={
                <>
                  <PlayButton />
                  <Volume />
                  <TimeDisplay />
                </>
              }
              right={<FullscreenButton />}
            />
          </>
        )}
      </Container>
    </MediaControllerProvider>
  ) : null;
}
