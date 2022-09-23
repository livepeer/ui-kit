import {
  AudioSrc,
  ControlsOptions,
  HlsSrc,
  ThemeConfig,
  VideoSrc,
  getMediaSourceType,
} from 'livepeer';
import * as React from 'react';

import { usePlaybackInfo } from '../../hooks';
import { AudioPlayer } from './AudioPlayer';
import { HlsPlayer, HlsPlayerProps } from './HlsPlayer';
import { VideoPlayer } from './VideoPlayer';
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
  Pick<HlsPlayerProps, 'hlsConfig' | 'loop'>
> & {
  /** The source(s) of the media (required if `playbackId` is not provided) */
  src?: string | string[];
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
} & (
    | {
        src: string | string[];
        playbackId?: never;
      }
    | {
        playbackId: string;
        src?: never;
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
  muted,
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

  const { data: playbackInfo } = usePlaybackInfo({
    playbackId,
    refetchInterval: (info) => (info ? false : refetchPlaybackInfoInterval),
    enabled: !src,
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
    }
  }, [playbackInfo]);

  const sourceTyped = React.useMemo(
    () =>
      src
        ? Array.isArray(src)
          ? (src.map((s) => getMediaSourceType(s)).filter((s) => s) as (
              | HlsSrc
              | AudioSrc
              | VideoSrc
            )[])
          : getMediaSourceType(src)
        : playbackUrl
        ? getMediaSourceType(playbackUrl)
        : null,
    [playbackUrl, src],
  );

  const playerRef = React.useCallback(
    (element: HTMLMediaElement | null) => {
      if (element && !mediaElement) {
        setMediaElement(element);
      }
    },
    [mediaElement],
  );

  const contextTheme = useTheme(theme);

  return (
    <MediaControllerProvider element={mediaElement} options={controls}>
      <Container className={contextTheme}>
        {sourceTyped &&
        (Array.isArray(sourceTyped)
          ? sourceTyped?.[0]?.type === 'hls'
          : sourceTyped?.type === 'hls') ? (
          <HlsPlayer
            hlsConfig={hlsConfig}
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={sourceTyped}
            poster={typeof poster === 'string' ? poster : undefined}
            loop={loop}
          />
        ) : sourceTyped?.type === 'video' ? (
          <VideoPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={sourceTyped}
            poster={typeof poster === 'string' ? poster : undefined}
            loop={loop}
          />
        ) : sourceTyped?.type === 'audio' ? (
          <AudioPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={sourceTyped}
            loop={loop}
          />
        ) : (
          'Your audio or video format could not be identified. Please retry with another source.'
        )}

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              hidePosterOnPlayed={sourceTyped?.type !== 'audio'}
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
  );
}
