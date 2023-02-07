import { AudioSrc, VideoSrc } from '@livepeer/core-react';
import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';

import * as React from 'react';
import { Dimensions, ImageProps } from 'react-native';

import { ControlsContainer, PlayButton } from './controls';
import { Container } from './controls/Container';
import { FullscreenButton } from './controls/FullscreenButton';
import { Progress } from './controls/Progress';
import { TimeDisplay } from './controls/TimeDisplay';
import { Title } from './controls/Title';
import { Volume } from './controls/Volume';

import { AudioPlayer, VideoPlayer } from './players';
import { VideoCustomizationProps } from './players/VideoPlayer';
import { MediaElement } from './types';
import { MediaControllerProvider } from '../../context/MediaControllerProvider';

export type { PlayerObjectFit };

export type PosterSource = ImageProps['source'];

export type PlayerProps = CorePlayerProps<MediaElement, PosterSource> &
  VideoCustomizationProps;

const screenDimensions = Dimensions.get('screen');

export const PlayerInternal = (props: PlayerProps) => {
  const [dimensions, setDimensions] = React.useState(screenDimensions);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  }, []);

  const {
    mediaElement,
    playerProps,
    controlsContainerProps,
    source,
    props: { controls, children, theme, title, showTitle, aspectRatio },
  } = usePlayer<MediaElement, PosterSource>(props, {
    // TODO fix to track when an element is shown on screen
    _isCurrentlyShown: true,
    _screenWidth: dimensions?.width ? dimensions.width : null,
  });

  return (
    <MediaControllerProvider
      element={mediaElement}
      opts={controls ?? {}}
      playerProps={props}
    >
      <Container theme={theme} aspectRatio={aspectRatio}>
        {source && source?.[0]?.type === 'audio' ? (
          <AudioPlayer {...playerProps} src={source as AudioSrc[]} />
        ) : (
          <VideoPlayer
            {...playerProps}
            src={source as VideoSrc[] | null}
            audioMode={props.audioMode}
          />
        )}

        {React.isValidElement(children) ? (
          React.cloneElement(children, controlsContainerProps)
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
