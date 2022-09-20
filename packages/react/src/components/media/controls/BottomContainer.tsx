import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';

import { useMediaController } from '../context';

const mediaControllerSelector = ({
  hidden,
  togglePlay,
  buffered,
}: MediaControllerState<HTMLMediaElement>) => ({
  hidden,
  togglePlay,
  buffered,
});

export type BottomContainerProps = PropsOf<'div'> & {
  topControls: React.ReactNode;
  leftControls: React.ReactNode;
  rightControls: React.ReactNode;
};

export const BottomContainer = React.forwardRef<
  HTMLDivElement,
  BottomContainerProps
>((props, ref) => {
  const { topControls, leftControls, rightControls, ...rest } = props;

  const { hidden, togglePlay, buffered } = useMediaController(
    mediaControllerSelector,
  );

  const onClickBackground = React.useCallback(() => togglePlay(), [togglePlay]);

  const isLoading = React.useMemo(() => buffered === 0, [buffered]);

  return (
    <>
      <div
        className={styling.controlsContainer.background()}
        onClick={onClickBackground}
      >
        {isLoading && (
          <div className={styling.controlsContainer.loading()}>
            <div />
          </div>
        )}
      </div>

      {!isLoading && (
        <>
          <div
            className={styling.controlsContainer.gradient({
              visibility: hidden ? 'hidden' : 'shown',
            })}
            onClick={onClickBackground}
          />
          <div
            className={styling.controlsContainer.bottom.container({
              visibility: hidden ? 'hidden' : 'shown',
            })}
            ref={ref}
            {...rest}
          >
            <div className={styling.controlsContainer.bottom.upper.container()}>
              {topControls}
            </div>
            <div className={styling.controlsContainer.bottom.lower.container()}>
              <div className={styling.controlsContainer.bottom.lower.left()}>
                {leftControls}
              </div>
              <div className={styling.controlsContainer.bottom.lower.right()}>
                {rightControls}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

BottomContainer.displayName = 'BottomContainer';
