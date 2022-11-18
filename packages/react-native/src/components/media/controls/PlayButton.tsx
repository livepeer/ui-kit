import { useConditionalIcon } from '@livepeer/core-react/hooks';
import { MediaControllerState } from 'livepeer';

import * as React from 'react';
import { GestureResponderEvent } from 'react-native';

import { Path } from 'react-native-svg';

import { useMediaController } from '../../../context';
import { IconButton } from '../../styling';
import { ColoredSvg } from '../../styling/button';
import { PropsOf } from '../../system';
import { MediaElement } from '../types';

const DefaultPlayIcon = () => (
  <ColoredSvg width="100%" height="100%" viewBox="0 0 36 36" fill="none">
    <Path
      d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
      fill="currentColor"
    />
  </ColoredSvg>
);

const DefaultPauseIcon = () => (
  <ColoredSvg width="100%" height="100%" viewBox="0 0 36 36" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
      fill="currentColor"
    />
  </ColoredSvg>
);

export type PlayButtonProps = Omit<PropsOf<typeof IconButton>, 'children'> & {
  /**
   * The play icon to be used for the button.
   * @type React.ReactElement
   */
  playIcon?: React.ReactElement;
  /**
   * The pause icon to be used for the button.
   * @type React.ReactElement
   */
  pauseIcon?: React.ReactElement;
} & (
    | {
        playIcon: React.ReactElement;
        pauseIcon: React.ReactElement;
      }
    | Record<string, never>
  );

const mediaControllerSelector = ({
  togglePlay,
  playing,
}: MediaControllerState<MediaElement>) => ({
  togglePlay,
  playing,
});

export const PlayButton = React.forwardRef<typeof IconButton, PlayButtonProps>(
  (props, _ref) => {
    const { togglePlay, playing } = useMediaController(mediaControllerSelector);

    const { playIcon, pauseIcon, onPress, ...rest } = props;

    const onPressComposed = async (e: GestureResponderEvent) => {
      await onPress?.(e);
      await togglePlay();
    };

    const _children = useConditionalIcon(
      playing,
      pauseIcon,
      <DefaultPauseIcon />,
      playIcon,
      <DefaultPlayIcon />,
    );

    const title = React.useMemo(
      () => (playing ? 'Pause (k)' : 'Play (k)'),
      [playing],
    );

    return (
      <IconButton
        {...rest}
        // className={styling.iconButton()}
        // title={title}
        // aria-label={title}
        accessibilityLabel={title}
        // ref={ref}
        onPress={onPressComposed}
      >
        {_children}
      </IconButton>
    );
  },
);
