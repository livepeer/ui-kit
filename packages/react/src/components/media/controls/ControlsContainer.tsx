import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

const mediaControllerSelector = ({
  hidden,
  togglePlay,
  canPlay,
  hasPlayed,
  buffered,
}: MediaControllerState<HTMLMediaElement>) => ({
  hidden,
  togglePlay,
  canPlay,
  hasPlayed,
  buffered,
});

export type ControlsContainerProps = {
  showLoadingSpinner?: boolean;
  hidePosterOnPlayed?: boolean;
  poster?: React.ReactNode;

  top?: React.ReactNode;
  middle?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export const ControlsContainer = React.forwardRef<
  HTMLDivElement,
  ControlsContainerProps
>((props, ref) => {
  const {
    top,
    middle,
    left,
    right,
    poster,
    showLoadingSpinner,
    hidePosterOnPlayed,
  } = props;

  const { hidden, togglePlay, canPlay, hasPlayed, buffered } =
    useMediaController(mediaControllerSelector);

  const isLoaded = React.useMemo(
    () => canPlay || buffered !== 0,
    [canPlay, buffered],
  );

  const onClickBackground = React.useCallback(() => {
    if (isLoaded) {
      togglePlay();
    }
  }, [togglePlay, isLoaded]);

  return (
    <>
      {poster && (
        <div
          className={styling.controlsContainer.background({
            display: hasPlayed && hidePosterOnPlayed ? 'hidden' : 'shown',
          })}
          onMouseUp={onClickBackground}
        >
          {poster}
        </div>
      )}
      {showLoadingSpinner && !isLoaded && (
        <div
          className={styling.controlsContainer.background()}
          onMouseUp={onClickBackground}
        >
          <div className={styling.controlsContainer.loading()} />
        </div>
      )}

      {isLoaded && (
        <>
          <div
            className={styling.controlsContainer.gradient({
              display: hidden ? 'hidden' : 'shown',
            })}
            onMouseUp={onClickBackground}
          />
          <div
            className={styling.controlsContainer.top.container({
              display: hidden ? 'hidden' : 'shown',
            })}
          >
            {top}
          </div>
          <div
            className={styling.controlsContainer.bottom.container({
              display: hidden ? 'hidden' : 'shown',
            })}
            ref={ref}
          >
            <div
              className={styling.controlsContainer.bottom.middle.container()}
            >
              {middle}
            </div>
            <div className={styling.controlsContainer.bottom.lower.container()}>
              <div className={styling.controlsContainer.bottom.lower.left()}>
                {left}
              </div>
              <div className={styling.controlsContainer.bottom.lower.right()}>
                {right}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

ControlsContainer.displayName = 'ControlsContainer';
