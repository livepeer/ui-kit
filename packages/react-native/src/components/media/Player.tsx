import { AudioSrc, VideoSrc } from '@livepeer/core-react';
import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';

import * as React from 'react';
import { ImageProps } from 'react-native';

import { ControlsContainer, PlayButton } from './controls';
import { Container } from './controls/Container';
import { FullscreenButton } from './controls/FullscreenButton';
import { Progress } from './controls/Progress';
import { TimeDisplay } from './controls/TimeDisplay';
import { Title } from './controls/Title';
import { Volume } from './controls/Volume';

import { AudioPlayer, HlsPlayer, VideoPlayer } from './players';
import { VideoCustomizationProps } from './players/VideoPlayer';
import { MediaElement } from './types';
import { MediaControllerProvider } from '../../context/MediaControllerProvider';

export type { PlayerObjectFit };

export type PosterSource = ImageProps['source'];

export type PlayerProps = CorePlayerProps<MediaElement, PosterSource> &
  VideoCustomizationProps;

export const PlayerInternal = (props: PlayerProps) => {
  const {
    mediaElement,
    playerProps,
    controlsContainerProps,
    source,
    props: {
      controls,
      children,
      theme,
      title,
      onMetricsError,
      showTitle,
      aspectRatio,
    },
  } = usePlayer<MediaElement, PosterSource>(props, {
    // TODO fix to track when an element is shown on screen
    _isCurrentlyShown: true,
  });

  return (
    <MediaControllerProvider
      element={mediaElement}
      opts={controls ?? {}}
      playerProps={props}
    >
      <Container theme={theme} aspectRatio={aspectRatio}>
        {source && !Array.isArray(source) ? (
          <HlsPlayer
            {...playerProps}
            src={source}
            onMetricsError={onMetricsError}
            audioMode={props.audioMode}
          />
        ) : source?.[0]?.type === 'audio' ? (
          <AudioPlayer {...playerProps} src={source as AudioSrc[]} />
        ) : (
          <VideoPlayer
            {...playerProps}
            src={source as VideoSrc[] | null}
            audioMode={props.audioMode}
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
};

export const Player = React.memo(PlayerInternal);
