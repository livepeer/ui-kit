import {
  PlayerProps as CorePlayerProps,
  PlayerObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';
import { AudioSrc, VideoSrc } from 'livepeer/media';

import * as React from 'react';
import { ImageProps } from 'react-native';

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

export type { PlayerObjectFit };

export type PosterSource = ImageProps['source'];

export type PlayerProps = CorePlayerProps<PosterSource>;

export const PlayerInternal = React.forwardRef<MediaElement, PlayerProps>(
  (props, ref) => {
    const {
      mediaElement,
      playerProps,
      controlsContainerProps,
      source,
      props: { children, theme, title, onMetricsError, showTitle, aspectRatio },
    } = usePlayer<MediaElement, PosterSource>(props);

    return (
      <MediaControllerProvider element={mediaElement}>
        <Container theme={theme} aspectRatio={aspectRatio}>
          {source && !Array.isArray(source) ? (
            <HlsPlayer
              {...playerProps}
              src={source}
              onMetricsError={onMetricsError}
              ref={ref}
            />
          ) : source?.[0]?.type === 'audio' ? (
            <AudioPlayer
              {...playerProps}
              src={source as AudioSrc[]}
              ref={ref}
            />
          ) : (
            <VideoPlayer
              {...playerProps}
              src={source as VideoSrc[] | null}
              ref={ref}
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
  },
);

export const Player = React.memo(PlayerInternal);
