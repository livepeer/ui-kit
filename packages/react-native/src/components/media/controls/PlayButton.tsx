import {
  PlayButtonProps,
  usePlayButton,
} from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

import { Path } from 'react-native-svg';

import { useMediaController } from '../../../context';
import { IconButton } from '../../styling';
import { ColoredSvg } from '../../styling/button';
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

const mediaControllerSelector = ({
  togglePlay,
  playing,
}: MediaControllerState<MediaElement>) => ({
  togglePlay,
  playing,
});

export type { PlayButtonProps };

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const { togglePlay, playing } = useMediaController(mediaControllerSelector);

  const { buttonProps, title } = usePlayButton({
    togglePlay,
    playing,
    defaultPauseIcon: <DefaultPauseIcon />,
    defaultPlayIcon: <DefaultPlayIcon />,
    ...props,
  });

  return <IconButton {...buttonProps} accessibilityLabel={title} />;
};
