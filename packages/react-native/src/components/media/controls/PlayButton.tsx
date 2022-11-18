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
  <ColoredSvg viewBox="0 0 36 36" fill="none">
    <Path d="m12 26 6.5-4v-8L12 10zm6.5-4 6.5-4-6.5-4z" fill="currentColor" />
  </ColoredSvg>
);

const DefaultPauseIcon = () => (
  <ColoredSvg viewBox="0 0 36 36" fill="none">
    <Path d="M12 26h4V10h-4zm9 0h4V10h-4z" fill="currentColor" />
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
