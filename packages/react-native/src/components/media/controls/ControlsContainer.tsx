import { MediaControllerState } from '@livepeer/core-react';
import {
  ControlsContainerProps,
  useControlsContainer,
} from '@livepeer/core-react/components';
import * as React from 'react';

import { useMediaController } from '../../../context';
import {
  Background,
  BottomContainer,
  Gradient,
  GradientImage,
  Left,
  LoadingText,
  Right,
  SpaceBetweenContainer,
  TopContainer,
} from '../../styling';
import { Loading } from '../../styling/loading';
import { useTheme } from '../../styling/stitches';
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

export type { ControlsContainerProps };

export const ControlsContainer: React.FC<ControlsContainerProps> = (props) => {
  const {
    top,
    middle,
    left,
    right,
    poster,
    showLoadingSpinner = true,
    hidePosterOnPlayed = true,
    loadingText,
  } = props;

  const { hidden, togglePlay, canPlay, hasPlayed, buffered } =
    useMediaController(mediaControllerSelector);

  const { isLoaded, containerProps } = useControlsContainer({
    togglePlay,
    canPlay,
    buffered,
  });

  const theme = useTheme();

  return (
    <>
      {poster ? (
        <Background
          display={hasPlayed && hidePosterOnPlayed ? 'hidden' : 'shown'}
          onTouchEnd={containerProps.onPress}
        >
          {poster}
        </Background>
      ) : (
        <Background display={'hidden'} onTouchEnd={containerProps.onPress} />
      )}
      {showLoadingSpinner && !isLoaded && (
        <Background>
          {loadingText && <LoadingText>{loadingText}</LoadingText>}

          <Loading size="small" color={theme.colors?.loading} />
        </Background>
      )}

      {isLoaded && (
        <>
          <Gradient
            display={hidden ? 'hidden' : 'shown'}
            onTouchEnd={containerProps.onPress}
          >
            <GradientImage
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADpCAYAAADlAl1mAAAAAXNSR0IArs4c6QAAAexJREFUOE9V0ftrzXEcx/H3x+43l9lmGGaz65ld2YUZG2YYKUlJUpKSpNZSkpSkJClJSVKSkj9Sj8/3nJ12fnie5/v9en/en+/3nIjik6rfNOU6YwfJqNGp0ctWGylSLavTqzNe72S9YYgGaYOysYJodKxJ2uSeZseaC4uUWpQt0lbWWlhEtFnVZv1O5RbSLkHGbifKiBR7XJnR7kS7dG+BSNlSh7TDvZ02d5rL6DLXxfYZriCiW69bbz+rIKUDyoyDW+hxB0RPpJQOCTIOb8cRZUavB+r1QCyOVpD6WJ97s/Wb67f5GINsMaA3YG6QDbIh7zZUWEQaNjesHHHRiB7EqLlRx0qsZKQkHdMb0zturopx5bhgwqoJJaRJNmnBlGBKj8W0YNq+GTbjFzrBqjipzJh1bNYxFnNsjs1bMF9YpFhgC3qnCkQkiNMMYlGwqDzDyoiIJc+35O85a66MFHFOmbHsjmVnM1Y884rgvLKClC4oIS5ux6pg1ZZLgow1v9pa2SIus4wrBVKkbFedhVhn67Zku2bBdcENr3CT3ZLe9oJ32F12T3DfCz7QewiP9B7b8kT5VPmMbVi6yZ7DCwtemnvFXrvoDXtr7p3gPXxQfhR8suqz8gv7Kv3mZb5Lf+j91PvFfsMf+Av//gMAXDGpZ05jKQAAAABJRU5ErkJggg==',
              }}
            />
          </Gradient>
          <TopContainer display={hidden ? 'hidden' : 'shown'}>
            {top}
          </TopContainer>
          <BottomContainer display={hidden ? 'hidden' : 'shown'}>
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
};
