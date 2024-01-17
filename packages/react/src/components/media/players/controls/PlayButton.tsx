import {
  PlayButtonProps,
  usePlayButton,
} from "@livepeer/core-react/components";
import { MediaControllerState, omit } from "@livepeer/core-web";
import { styling } from "@livepeer/core-web/media/browser/styling";

import { useMediaController } from "../../../../../context/dist/livepeer-react-context.cjs";

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
      className={styling.iconButton.button()}
      title={title}
      aria-label={title}
      onClick={buttonProps.onPress}
      {...omit(buttonProps, "onPress", "size")}
    />
  );
};
