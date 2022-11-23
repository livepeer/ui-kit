import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';
import { AudioSrc, VideoSrc } from 'livepeer/media';
import { ControlsOptions } from 'livepeer/media/browser';

import * as React from 'react';

import { MediaControllerProvider } from '../../context';

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

export function Player(props: PlayerProps) {
  const {
    mediaElement,
    playerProps,
    controlsContainerProps,
    source,
    props: {
      autoPlay,
      children,
      controls,
      muted,
      theme,
      title,
      poster,
      loop,
      onMetricsError,
      showTitle,
      aspectRatio,
      objectFit,
    },
  } = usePlayer<HTMLMediaElement>(props);

  return (
    <MediaControllerProvider element={mediaElement} options={controls}>
      <Container theme={theme} aspectRatio={aspectRatio}>
        {source && !Array.isArray(source) ? (
          <HlsPlayer
            {...playerProps}
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
            {...playerProps}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source as AudioSrc[]}
            loop={loop}
            objectFit={objectFit}
          />
        ) : (
          <VideoPlayer
            {...playerProps}
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
              {...controlsContainerProps}
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
                  {props.showPipButton && <PictureInPictureButton />}
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
