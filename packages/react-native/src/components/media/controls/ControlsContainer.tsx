import { MediaControllerState } from 'livepeer';
import * as React from 'react';
import { ViewComponent } from 'react-native';

import { useMediaController } from '../../../context';
import {
  Background,
  BottomContainer,
  Gradient,
  Left,
  LoadingText,
  Right,
  SpaceBetweenContainer,
  TopContainer,
} from '../../styling';
import { Loading } from '../../styling/loading';
import { MediaElement } from '../types';

const mediaControllerSelector = ({
  hidden,
  togglePlay,
  canPlay,
  hasPlayed,
  buffered,
}: MediaControllerState<MediaElement>) => ({
  hidden,
  togglePlay,
  canPlay,
  hasPlayed,
  buffered,
});

export type ControlsContainerProps = {
  topLoadingText?: string | null;
  showLoadingSpinner?: boolean;
  hidePosterOnPlayed?: boolean;
  poster?: React.ReactNode;

  top?: React.ReactNode;
  middle?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export const ControlsContainer = React.forwardRef<
  ViewComponent,
  ControlsContainerProps
>((props, ref) => {
  const {
    top,
    middle,
    left,
    right,
    poster,
    showLoadingSpinner = true,
    hidePosterOnPlayed = true,
    topLoadingText,
  } = props;

  const { hidden, togglePlay, canPlay, hasPlayed, buffered } =
    useMediaController(mediaControllerSelector);

  const isLoaded = React.useMemo(
    () => canPlay || buffered !== 0,
    [canPlay, buffered],
  );

  const onPressBackground = React.useCallback(() => {
    if (isLoaded) {
      togglePlay();
    }
  }, [togglePlay, isLoaded]);

  return (
    <>
      {poster ? (
        <Background
          display={hasPlayed && hidePosterOnPlayed ? 'hidden' : 'shown'}
          onTouchEnd={onPressBackground}
        >
          {poster}
        </Background>
      ) : (
        <Background display={'hidden'} onTouchEnd={onPressBackground} />
      )}
      {showLoadingSpinner && !isLoaded && (
        <Background>
          {topLoadingText && <LoadingText>{topLoadingText}</LoadingText>}

          <Loading />
        </Background>
      )}

      {isLoaded && (
        <>
          <Gradient
            display={hidden ? 'hidden' : 'shown'}
            onTouchEnd={onPressBackground}
          />
          <TopContainer display={hidden ? 'hidden' : 'shown'}>
            {top}
          </TopContainer>
          <BottomContainer display={hidden ? 'hidden' : 'shown'} ref={ref}>
            <SpaceBetweenContainer>{middle}</SpaceBetweenContainer>
            <SpaceBetweenContainer>
              <Left>{left}</Left>
              <Right>{right}</Right>
            </SpaceBetweenContainer>
          </BottomContainer>
        </>
      )}
    </>
  );
});

ControlsContainer.displayName = 'ControlsContainer';
