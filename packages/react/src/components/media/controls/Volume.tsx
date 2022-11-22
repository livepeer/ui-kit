import { useVolume } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { PropsOf } from '../../system';
import { BaseSlider } from './BaseSlider';

const DefaultMutedIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 36 36">
    <path d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="currentColor" />
    <path
      fill="currentColor"
      d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
    ></path>
  </svg>
);

const DefaultUnmutedIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 36 36">
    <path
      fill="currentColor"
      d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
    ></path>
  </svg>
);

const mediaControllerSelector = ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
  volume,
}: MediaControllerState<HTMLMediaElement>) => ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
  volume,
});

export type VolumeProps = Omit<PropsOf<'button'>, 'children'> & {
  /**
   * Toggles showing the slider to change the volume level. Defaults to true.
   * If false, the volume will toggle between 0% and 100%.
   */
  showSlider?: boolean;
  /**
   * The icon to be used for the button when unmuted.
   * @type React.ReactElement
   */
  unmutedIcon?: React.ReactElement;
  /**
   * The icon to be used for the button when muted.
   * @type React.ReactElement
   */
  mutedIcon?: React.ReactElement;
};

export const Volume = (props: VolumeProps) => {
  const {
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
  } = useMediaController(mediaControllerSelector);

  const { progressProps, buttonProps, title } = useVolume({
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
    defaultMutedIcon: <DefaultMutedIcon />,
    defaultUnmutedIcon: <DefaultUnmutedIcon />,
    ...props,
  });

  return (
    <div className={styling.volume.container()}>
      <button
        className={styling.iconButton()}
        title={title}
        aria-label={title}
        onClick={buttonProps.onPress}
        {...buttonProps}
      />

      {progressProps.shown && (
        <BaseSlider
          ariaName="volume"
          value={muted ? 0 : volume}
          {...progressProps}
        />
      )}
    </div>
  );
};
