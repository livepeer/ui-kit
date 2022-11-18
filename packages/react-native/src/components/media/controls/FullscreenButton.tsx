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

const DefaultEnterFullscreenIcon = () => (
  <ColoredSvg viewBox="0 0 36 36" fill="none">
    <Path
      fill="currentColor"
      d="M10 16h2v-4h4v-2h-6v6zM20 10v2h4v4h2v-6h-6zM24 24h-4v2h6v-6h-2v4zM12 20h-2v6h6v-2h-4v-4z"
    />
  </ColoredSvg>
);

const DefaultExitFullscreenIcon = () => (
  <ColoredSvg viewBox="0 0 36 36">
    <Path
      fill="currentColor"
      d="M14 14h-4v2h6v-6h-2v4zM22 14v-4h-2v6h6v-2h-4zM20 26h2v-4h4v-2h-6v6zM10 22h4v4h2v-6h-6v2z"
    />
  </ColoredSvg>
);

const mediaControllerSelector = ({
  fullscreen,
  pictureInPicture,
  requestToggleFullscreen,
}: MediaControllerState<MediaElement>) => ({
  fullscreen,
  pictureInPicture,
  requestToggleFullscreen,
});

export type FullscreenButtonProps = Omit<
  PropsOf<typeof IconButton>,
  'children'
> & {
  /**
   * The enter fullscreen icon to be used for the button.
   * @type React.ReactElement
   */
  enterIcon?: React.ReactElement;
  /**
   * The exit fullscreen icon to be used for the button.
   * @type React.ReactElement
   */
  exitIcon?: React.ReactElement;
} & (
    | {
        enterIcon: React.ReactElement;
        exitIcon: React.ReactElement;
      }
    | Record<string, never>
  );

export const FullscreenButton = React.forwardRef<
  typeof IconButton,
  FullscreenButtonProps
>((props, ref) => {
  const { fullscreen, pictureInPicture, requestToggleFullscreen } =
    useMediaController(mediaControllerSelector);

  const { enterIcon, exitIcon, onPress, ...rest } = props;

  const onPressComposed = React.useCallback(
    async (e: GestureResponderEvent) => {
      await onPress?.(e);
      await requestToggleFullscreen();
    },
    [onPress, requestToggleFullscreen],
  );

  const _children = useConditionalIcon(
    fullscreen,
    exitIcon,
    <DefaultExitFullscreenIcon />,
    enterIcon,
    <DefaultEnterFullscreenIcon />,
  );

  const title = React.useMemo(
    () => (fullscreen ? 'Exit full screen (f)' : 'Full screen (f)'),
    [fullscreen],
  );

  if (pictureInPicture) {
    return <></>;
  }

  return (
    <IconButton
      {...rest}
      // className={styling.iconButton()}
      // title={title}
      // aria-label={title}
      accessibilityLabel={title}
      ref={ref}
      onPress={onPressComposed}
    >
      {_children}
    </IconButton>
  );
});

FullscreenButton.displayName = 'FullscreenButton';
