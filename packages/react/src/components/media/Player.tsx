import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';
import { AudioSrc, HlsSrc, VideoSrc } from 'livepeer/media';
import { ControlsOptions } from 'livepeer/media/browser';

import * as React from 'react';

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
import { AudioPlayer, VideoPlayer } from './players';
import { MediaControllerProvider } from '../../context';
import { useIsElementShown } from '../useIsElementShown';

export type PosterSource = string | React.ReactNode;

type PlayerProps = CorePlayerProps<HTMLMediaElement, PosterSource> & {
  /** Whether to show the picture in picture button (web only) */
  showPipButton?: boolean;
  /** Configuration for the event listeners */
  controls?: ControlsOptions;
};

export type { PlayerObjectFit, PlayerProps };

export const PlayerInternal = (props: PlayerProps) => {
  const [isCurrentlyShown, setIsCurrentlyShown] = React.useState(false);

  const screenWidth = React.useMemo(
    () =>
      typeof window !== 'undefined'
        ? (window?.screen?.availWidth || window?.innerWidth) ?? null
        : null,
    [],
  );

  const {
    mediaElement,
    playerProps,
    controlsContainerProps,
    source,
    props: { children, controls, theme, title, poster, showTitle, aspectRatio },
  } = usePlayer<HTMLMediaElement, PosterSource>(
    {
      ...props,
      _isCurrentlyShown: props._isCurrentlyShown ?? isCurrentlyShown,
    },
    {
      _screenWidth: screenWidth,
    },
  );

  const _isCurrentlyShown = useIsElementShown(mediaElement);

  React.useEffect(() => {
    setIsCurrentlyShown(_isCurrentlyShown);
  }, [_isCurrentlyShown]);

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
            src={source as (VideoSrc | HlsSrc)[] | null}
          />
        )}

        {React.isValidElement(children) ? (
          React.cloneElement(children, controlsContainerProps)
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
};

export const Player = React.memo(PlayerInternal);
