import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

const mediaControllerSelector = ({
  hidden,
  togglePlay,
  buffered,
  hasPlayed,
}: MediaControllerState<HTMLMediaElement>) => ({
  hidden,
  togglePlay,
  buffered,
  hasPlayed,
});

export type ControlsContainerProps = {
  showLoadingSpinner?: boolean;
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
  const { top, middle, left, right, poster, showLoadingSpinner } = props;

  const { hidden, togglePlay, buffered, hasPlayed } = useMediaController(
    mediaControllerSelector,
  );

  const onClickBackground = React.useCallback(() => togglePlay(), [togglePlay]);

  const isLoading = React.useMemo(() => buffered === 0, [buffered]);

  return (
    <>
      {poster && (
        <div
          className={styling.controlsContainer.background({
            display: hasPlayed ? 'hidden' : 'shown',
          })}
          onMouseUp={onClickBackground}
        >
          {poster}
        </div>
      )}
      {showLoadingSpinner && (
        <div
          className={styling.controlsContainer.background()}
          onMouseUp={onClickBackground}
        >
          {isLoading && <div className={styling.controlsContainer.loading()} />}
        </div>
      )}

      {!isLoading && (
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
