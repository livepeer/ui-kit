import {
  PlayButtonProps,
  usePlayButton,
} from '@livepeer/core-react/components';
import { MediaControllerState, omit } from '@livepeer/core-web';
import { styling } from '@livepeer/core-web/media/browser/styling';

import { useMediaController } from '../../../../context';

const DefaultPlayIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
      fill="currentColor"
    />
  </svg>
);

const DefaultPauseIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none">
    <path
      d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
      fill="currentColor"
    />
  </svg>
);

const mediaControllerSelector = ({
  togglePlay,
  playing,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
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

  return (
    <button
      style={{
        width: props.size,
        height: props.size,
      }}
      className={styling.iconButton()}
      title={title}
      aria-label={title}
      onClick={buttonProps.onPress}
      {...omit(buttonProps, 'onPress', 'size')}
    />
  );
};
