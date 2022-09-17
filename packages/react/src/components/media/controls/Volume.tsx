import { styled } from '@stitches/react';
import { MediaControllerState } from 'livepeer';
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

const Container = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledButton = styled('button', {
  borderRadius: 4,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  color: 'white',
  padding: 0,
  paddingTop: 3,
  '&:hover': {
    color: '#909090',
  },
});

const mediaControllerSelector = ({
  volume,
  requestToggleMute,
}: MediaControllerState<HTMLMediaElement>) => ({
  volume,
  requestToggleMute,
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
    const { volume, requestToggleMute } = useMediaController(
      mediaControllerSelector,
    );

    const { unmutedIcon, mutedIcon, onClick, ...rest } = props;

    const onClickComposed = React.useCallback(
      async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        requestToggleMute();
        await onClick?.(e);
      },
      [onClick, requestToggleMute],
    );

    const _children = useConditionalIcon(
      Boolean(volume),
      unmutedIcon,
      <DefaultUnmutedIcon size={42} />,
      mutedIcon,
      <DefaultMutedIcon size={42} />,
    );

    const title = React.useMemo(
      () => (volume ? 'Unmute (m)' : 'Mute (m)'),
      [volume],
    );

    return (
      <Container>
        <StyledButton
          title={title}
          aria-label={title}
          ref={ref}
          onClick={onClickComposed}
          {...rest}
        >
          {_children}
        </StyledButton>
        <VolumeProgress />
      </Container>
    );
  },
);

Volume.displayName = 'Volume';

const mediaControllerSelectorProgress = ({
  volume,
  requestVolume,
}: MediaControllerState<HTMLMediaElement>) => ({
  volume,
  requestVolume,
});

const VolumeProgress = () => {
  const { volume, requestVolume } = useMediaController(
    mediaControllerSelectorProgress,
  );

  const onChange = React.useCallback(
    async (value: number) => {
      requestVolume(value);
    },
    [requestVolume],
  );

  return <BaseSlider ariaName="volume" value={volume} onChange={onChange} />;
};
