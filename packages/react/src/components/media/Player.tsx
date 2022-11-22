import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  useSourceMimeTyped,
} from '@livepeer/core-react/components';
import { AudioSrc, VideoSrc } from 'livepeer/media';
import { ControlsOptions } from 'livepeer/media/browser';

import { isNumber } from 'livepeer/utils';
import * as React from 'react';

import { MediaControllerProvider, useTheme } from '../../context';

import {
  Container,
  ControlsContainer,
  FullscreenButton,
  PictureInPictureButton,
  PlayButton,
  Poster,
  Progress,
  TimeDisplay,
  Title,
  Volume,
} from './controls';
import { AudioPlayer, HlsPlayer, VideoPlayer } from './players';

type PlayerProps = CorePlayerProps & {
  /** Whether to show the picture in picture button (web only) */
  showPipButton?: boolean;
  /** Configuration for the event listeners */
  controls?: ControlsOptions;
};

export type { PlayerObjectFit, PlayerProps };

export function Player({
  autoPlay,
  children,
  controls,
  muted,
  playbackId,
  refetchPlaybackInfoInterval = 5000,
  src,
  theme,
  title,
  poster,
  loop,
  shouldShowLoadingSpinner = true,
  showTitle = true,
  aspectRatio = '16to9',
  objectFit = 'cover',
  showPipButton,
  autoUrlUpload = true,
  onMetricsError,
  jwt,
}: PlayerProps) {
  const [mediaElement, setMediaElement] =
    React.useState<HTMLMediaElement | null>(null);

  const { source, uploadStatus } = useSourceMimeTyped({
    src,
    playbackId,
    jwt,
    refetchPlaybackInfoInterval,
    autoUrlUpload,
  });

  const hidePosterOnPlayed = React.useMemo(
    () =>
      Array.isArray(source)
        ? source?.[0]?.type !== 'audio'
          ? true
          : undefined
        : undefined,
    [source],
  );

  const playerRef = React.useCallback((element: HTMLMediaElement | null) => {
    if (element) {
      setMediaElement(element);
    }
  }, []);

  const contextTheme = useTheme(theme);

  const topLoadingText = React.useMemo(
    () =>
      uploadStatus?.phase === 'processing' && isNumber(uploadStatus?.progress)
        ? `Processing: ${(Number(uploadStatus?.progress) * 100).toFixed(0)}%`
        : uploadStatus?.phase === 'failed'
        ? 'Upload Failed'
        : null,
    [uploadStatus],
  );

  return (
    <MediaControllerProvider element={mediaElement} options={controls}>
      <Container className={contextTheme} aspectRatio={aspectRatio}>
        {source && !Array.isArray(source) ? (
          <HlsPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source}
            poster={typeof poster === 'string' ? poster : undefined}
            loop={loop}
            objectFit={objectFit}
            onMetricsError={onMetricsError}
          />
        ) : source?.[0]?.type === 'audio' ? (
          <AudioPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source as AudioSrc[]}
            loop={loop}
            objectFit={objectFit}
          />
        ) : (
          <VideoPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source as VideoSrc[] | null}
            poster={typeof poster === 'string' ? poster : undefined}
            loop={loop}
            objectFit={objectFit}
          />
        )}

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              hidePosterOnPlayed={hidePosterOnPlayed}
              shouldShowLoadingSpinner={shouldShowLoadingSpinner}
              loadingText={topLoadingText}
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
              right={
                <>
                  {showPipButton && <PictureInPictureButton />}
                  <FullscreenButton />
                </>
              }
            />
          </>
        )}
      </Container>
    </MediaControllerProvider>
  );
}
