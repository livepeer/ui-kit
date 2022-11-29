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

export type PosterSource = string | React.ReactNode;

type PlayerProps = CorePlayerProps<PosterSource> & {
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
      children,
      controls,
      theme,
      title,
      poster,
      onMetricsError,
      showTitle,
      aspectRatio,
    },
  } = usePlayer<HTMLMediaElement, PosterSource>(props);

  return (
    <MediaControllerProvider element={mediaElement} options={controls}>
      <Container theme={theme} aspectRatio={aspectRatio}>
        {source && !Array.isArray(source) ? (
          <HlsPlayer
            {...playerProps}
            src={source}
            onMetricsError={onMetricsError}
          />
        ) : source?.[0]?.type === 'audio' ? (
          <AudioPlayer {...playerProps} src={source as AudioSrc[]} />
        ) : (
          <VideoPlayer {...playerProps} src={source as VideoSrc[] | null} />
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
