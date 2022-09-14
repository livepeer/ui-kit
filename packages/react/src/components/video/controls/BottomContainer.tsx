import { styled } from '@stitches/react';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

import { PropsOf } from './system';

const BackgroundClickHandler = styled('div', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  height: '100%',
});

const BottomGradient = styled('div', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 233,
  backgroundImage:
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADpCAYAAADlAl1mAAAAAXNSR0IArs4c6QAAAexJREFUOE9V0ftrzXEcx/H3x+43l9lmGGaz65ld2YUZG2YYKUlJUpKSpNZSkpSkJClJSVKSkj9Sj8/3nJ12fnie5/v9en/en+/3nIjik6rfNOU6YwfJqNGp0ctWGylSLavTqzNe72S9YYgGaYOysYJodKxJ2uSeZseaC4uUWpQt0lbWWlhEtFnVZv1O5RbSLkHGbifKiBR7XJnR7kS7dG+BSNlSh7TDvZ02d5rL6DLXxfYZriCiW69bbz+rIKUDyoyDW+hxB0RPpJQOCTIOb8cRZUavB+r1QCyOVpD6WJ97s/Wb67f5GINsMaA3YG6QDbIh7zZUWEQaNjesHHHRiB7EqLlRx0qsZKQkHdMb0zturopx5bhgwqoJJaRJNmnBlGBKj8W0YNq+GTbjFzrBqjipzJh1bNYxFnNsjs1bMF9YpFhgC3qnCkQkiNMMYlGwqDzDyoiIJc+35O85a66MFHFOmbHsjmVnM1Y884rgvLKClC4oIS5ux6pg1ZZLgow1v9pa2SIus4wrBVKkbFedhVhn67Zku2bBdcENr3CT3ZLe9oJ32F12T3DfCz7QewiP9B7b8kT5VPmMbVi6yZ7DCwtemnvFXrvoDXtr7p3gPXxQfhR8suqz8gv7Kv3mZb5Lf+j91PvFfsMf+Av//gMAXDGpZ05jKQAAAABJRU5ErkJggg==")',
});

const StyledBottomContainer = styled('div', {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  marginLeft: 10,
  marginRight: 10,
});

const StyledTopContainer = styled('div', {
  width: '100%',
  display: 'inline-flex',
});

const StyledLowerContainer = styled('div', {
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledRightContainer = styled('div', {
  // justifySelf: 'flex-end',
});

const StyledLeftContainer = styled('div', {
  // justifySelf: 'flex-start',
});

const mediaControllerSelector = ({
  hidden,
  togglePlay,
}: MediaControllerState<HTMLMediaElement>) => ({
  hidden,
  togglePlay,
});

export type BottomContainerProps = Omit<
  PropsOf<typeof StyledBottomContainer>,
  'children'
> & {
  topControls: React.ReactNode;
  leftControls: React.ReactNode;
  rightControls: React.ReactNode;
};

export const BottomContainer = React.forwardRef<
  HTMLDivElement,
  BottomContainerProps
>((props, ref) => {
  const { hidden, togglePlay } = useMediaController(mediaControllerSelector);

  const onClickBackground = React.useCallback(() => togglePlay(), [togglePlay]);

  const css = React.useMemo(
    () => (hidden ? { display: 'none' } : {}),
    [hidden],
  );

  return (
    <>
      <BackgroundClickHandler onClick={onClickBackground} />
      <BottomGradient css={css} onClick={onClickBackground} />

      <StyledBottomContainer css={css} ref={ref}>
        <StyledTopContainer>{props.topControls}</StyledTopContainer>
        <StyledLowerContainer>
          <StyledLeftContainer>{props.leftControls}</StyledLeftContainer>
          <StyledRightContainer>{props.rightControls}</StyledRightContainer>
        </StyledLowerContainer>
      </StyledBottomContainer>
    </>
  );
});

BottomContainer.displayName = 'BottomContainer';
