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
  Progress,
  TimeDisplay,
  Volume,
} from './controls';
import { Title } from './controls/Title';

export type PlayerProps = Omit<
  GenericHlsPlayerProps,
  'src' | 'controls' | 'width' | 'autoPlay' | 'muted'
> & {
  /** The source of the media (required if `playbackId` is not provided) */
  src?: string;
  /** The playback ID for the media (required if `src` is not provided) */
  playbackId?: string;
  /** The title of the media */
  title?: string;

  /** The refetch interval for the playback info hook (used to query until there is a valid playback URL) */
  refetchPlaybackInfoInterval?: number;
  /** Callback for when the playback info is successfully updated */
  onPlaybackInfoUpdated?: (playbackInfo: PlaybackInfo) => void;
  /** Callback for when the playback info request fails */
  onPlaybackInfoError?: (error: Error) => void;

  /** Configuration for the event listeners */
  controls?: ControlsOptions;
  /** Theme configuration for the player */
  theme?: ThemeConfig;

  /** Play media automatically when the content loads (if this is specified, you must also specify muted, since this is required in browsers) */
  autoPlay?: boolean;
  /** Mute media by default */
  muted?: boolean;
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
  autoPlay = true,
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
  ...props
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
          {...props}
        />

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              top={<>{title && <Title content={title} />}</>}
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
