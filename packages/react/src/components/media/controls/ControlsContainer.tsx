import {
  ControlsContainerProps,
  PlaybackDisplayError,
  useControlsContainer,
} from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { OfflineStreamPlaybackDisplayError } from './PlaybackDisplayError';

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
    playbackDisplayError,
  } = props;

  const { hidden, togglePlay, canPlay, hasPlayed, buffered } =
    useMediaController(mediaControllerSelector);

  const { isLoaded, containerProps } = useControlsContainer({
    togglePlay,
    canPlay,
    buffered,
  });

  const playbackDisplayErrorComponent = React.useMemo(() => {
    switch (playbackDisplayError) {
      case PlaybackDisplayError.OfflineStream:
        return <OfflineStreamPlaybackDisplayError />;
      case PlaybackDisplayError.PrivateStream:
        return <div>PrivateStreamPlaybackDisplayError</div>;
      default:
        return <></>;
    }
  }, [playbackDisplayError]);

  return (
    <>
      {poster ? (
        <div
          className={styling.controlsContainer.background({
            display: hasPlayed && hidePosterOnPlayed ? 'hidden' : 'shown',
          })}
          onMouseUp={containerProps.onPress}
        >
          {poster}
        </div>
      ) : (
        <div
          className={styling.controlsContainer.background({
            display: 'hidden',
          })}
          onMouseUp={containerProps.onPress}
        />
      )}

      {showLoadingSpinner && !isLoaded && !playbackDisplayError && (
        <div
          className={styling.controlsContainer.background()}
          onMouseUp={containerProps.onPress}
        >
          {loadingText && (
            <div className={styling.controlsContainer.loadingText()}>
              {loadingText}
            </div>
          )}

          <div className={styling.controlsContainer.loading()} />
        </div>
      )}

      {playbackDisplayError && (
        <div
          className={styling.controlsContainer.background()}
          onMouseUp={containerProps.onPress}
        >
          {playbackDisplayErrorComponent}
        </div>
      )}

      {isLoaded && (
        <>
          <div
            className={styling.controlsContainer.gradient({
              display: hidden ? 'hidden' : 'shown',
            })}
            onMouseUp={containerProps.onPress}
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
};
