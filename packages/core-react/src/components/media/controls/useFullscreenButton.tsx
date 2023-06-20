import { MediaControllerState } from '@livepeer/core';

import * as React from 'react';

import { useConditionalIcon } from '../../../hooks';

type FullscreenButtonStateSlice = Pick<
  MediaControllerState,
  'fullscreen' | 'pictureInPicture' | 'requestToggleFullscreen'
>;

export type FullscreenButtonProps = {
  /**
   * The callback to trigger any logic on click/press.
   */
  onPress?: () => void;
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
  /**
   * The size of the icon.
   */
  size?: number | string;
};

type FullscreenButtonCoreProps = {
  defaultEnterIcon: React.ReactElement;
  defaultExitIcon: React.ReactElement;
} & FullscreenButtonStateSlice &
  FullscreenButtonProps;

export const useFullscreenButton = (props: FullscreenButtonCoreProps) => {
  const {
    enterIcon,
    exitIcon,
    onPress,
    fullscreen,
    pictureInPicture,
    requestToggleFullscreen,
    defaultEnterIcon,
    defaultExitIcon,
    ...rest
  } = props;

  const onPressComposed = React.useCallback(async () => {
    await onPress?.();
    await requestToggleFullscreen();
  }, [onPress, requestToggleFullscreen]);

  const _children = useConditionalIcon(
    fullscreen,
    exitIcon,
    defaultExitIcon,
    enterIcon,
    defaultEnterIcon,
  );

  const title = React.useMemo(
    () => (fullscreen ? 'Exit full screen (f)' : 'Full screen (f)'),
    [fullscreen],
  );

  return {
    title,
    buttonProps: pictureInPicture
      ? null
      : {
          onPress: onPressComposed,
          children: _children,
          ...rest,
        },
  };
};
