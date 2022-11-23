import {
  PlayerObjectFit,
  PlayerProps,
  usePlayer,
} from '@livepeer/core-react/components';
import { AudioSrc, VideoSrc } from 'livepeer/media';

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
  } = usePlayer<MediaElement>(props);

  return (
    <MediaControllerProvider element={mediaElement}>
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
            options={controls}
          />
        ) : source?.[0]?.type === 'audio' ? (
          <AudioPlayer
            {...playerProps}
            autoPlay={autoPlay}
            muted={autoPlay ? true : muted}
            src={source as AudioSrc[]}
            loop={loop}
            objectFit={objectFit}
            options={controls}
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
            options={controls}
          />
        )}

        {React.isValidElement(children) ? (
          children
        ) : (
          <>
            <ControlsContainer
              {...controlsContainerProps}
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
