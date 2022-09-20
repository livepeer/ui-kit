import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { PropsOf, useConditionalIcon } from '../../system';
import { useMediaController } from '../context';
import { BaseSlider } from './BaseSlider';

const DefaultMutedIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36">
    <path d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="currentColor" />
    <path
      fill="currentColor"
      d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
    ></path>
  </svg>
);

const DefaultUnmutedIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36">
    <path
      fill="currentColor"
      d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"
    ></path>
  </svg>
);

const mediaControllerSelector = ({
  isVolumeChangeSupported,
  requestToggleMute,
  muted,
}: MediaControllerState<HTMLMediaElement>) => ({
  isVolumeChangeSupported,
  requestToggleMute,
  muted,
});

export type VolumeProps = Omit<PropsOf<'button'>, 'children'> & {
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
} & (
    | {
        unmutedIcon: React.ReactElement;
        mutedIcon: React.ReactElement;
      }
    | Record<string, never>
  );

export const Volume = React.forwardRef<HTMLButtonElement, VolumeProps>(
  (props, ref) => {
    const { requestToggleMute, muted, isVolumeChangeSupported } =
      useMediaController(mediaControllerSelector);

    const { unmutedIcon, mutedIcon, onClick, ...rest } = props;

    const onClickComposed = React.useCallback(
      async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        requestToggleMute();
        await onClick?.(e);
      },
      [onClick, requestToggleMute],
    );

    const _children = useConditionalIcon(
      !muted,
      unmutedIcon,
      <DefaultUnmutedIcon size={42} />,
      mutedIcon,
      <DefaultMutedIcon size={42} />,
    );

    const title = React.useMemo(
      () => (muted ? 'Unmute (m)' : 'Mute (m)'),
      [muted],
    );

    return (
      <div className={styling.volume.container()}>
        <button
          className={styling.iconButton()}
          title={title}
          aria-label={title}
          ref={ref}
          onClick={onClickComposed}
          {...rest}
        >
          {_children}
        </button>

        {isVolumeChangeSupported && <VolumeProgress />}
      </div>
    );
  },
);

Volume.displayName = 'Volume';

const mediaControllerSelectorProgress = ({
  volume,
  requestVolume,
  muted,
}: MediaControllerState<HTMLMediaElement>) => ({
  volume,
  requestVolume,
  muted,
});

const VolumeProgress = () => {
  const { volume, requestVolume, muted } = useMediaController(
    mediaControllerSelectorProgress,
  );

  const onChange = React.useCallback(
    async (value: number) => {
      requestVolume(value);
    },
    [requestVolume],
  );

  return (
    <BaseSlider
      ariaName="volume"
      value={muted ? 0 : volume}
      onChange={onChange}
    />
  );
};
