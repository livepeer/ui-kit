import {
  PlayerObjectFit,
  PlayerProps,
  useSourceMimeTyped,
} from '@livepeer/core-react/components';
import { AudioSrc, VideoSrc } from 'livepeer/media';
import { isNumber } from 'livepeer/utils';

import * as React from 'react';

import { MediaControllerProvider } from '../../context/MediaControllerProvider';

import { ControlsContainer, PlayButton } from './controls';
import { Container } from './controls/Container';
import { FullscreenButton } from './controls/FullscreenButton';
import { Progress } from './controls/Progress';
import { TimeDisplay } from './controls/TimeDisplay';
import { Title } from './controls/Title';
import { Volume } from './controls/Volume';

import { AudioPlayer, HlsPlayer, VideoPlayer } from './players';
import { MediaElement } from './types';

export type { PlayerObjectFit, PlayerProps };

export function Player({
  autoPlay,
  children,
  controls,
  muted,
  playbackId,
  refetchPlaybackInfoInterval = 5000,
  src,
  // theme,
  title,
  poster,
  loop,
  showLoadingSpinner = true,
  showTitle = true,
  aspectRatio = '16to9',
  objectFit = 'cover',
  // showPipButton,
  autoUrlUpload = true,
  onMetricsError,
  jwt,
}: PlayerProps) {
  const [mediaElement, setMediaElement] = React.useState<MediaElement | null>(
    null,
  );

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

  // const contextTheme = React.useContext(ThemeContext);

  const playerRef = React.useCallback((element: MediaElement | null) => {
    if (element) {
      setMediaElement(element);
    }
  }, []);

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
    <MediaControllerProvider element={mediaElement}>
      <Container aspectRatio={aspectRatio}>
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
            options={controls}
          />
        ) : source?.[0]?.type === 'audio' ? (
          <AudioPlayer
            ref={playerRef}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source as AudioSrc[]}
            loop={loop}
            objectFit={objectFit}
            options={controls}
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
            options={controls}
          />
        )}

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              hidePosterOnPlayed={hidePosterOnPlayed}
              showLoadingSpinner={showLoadingSpinner}
              topLoadingText={topLoadingText}
              top={<>{title && showTitle && <Title content={title} />}</>}
              middle={
                <>
                  <Progress />
                </>
              }
              left={
                <>
                  <PlayButton />
                  <Volume />
                  <TimeDisplay />
                </>
              }
              right={
                <>
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
