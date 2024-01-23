import { useConditionalIcon } from "@livepeer/core-react/hooks";
import { MediaControllerState, omit } from "@livepeer/core-web";

import { styling } from "@livepeer/core-web/media/browser/styling";
import React, { useMemo } from "react";

import { useMediaController } from "../../../../player/context";

const DefaultOnIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="-340 -1265 1600 1600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h520q24 0 42 18t18 42v215l160-160v410L720-435v215q0 24-18 42t-42 18H140Zm0-60h520v-520H140v520Zm0 0v-520 520Z"
    />
  </svg>
);

const DefaultOffIcon = () => (
  <svg width="100%" height="100%" viewBox="-340 -1265 1600 1600" fill="none">
    <path
      fill="currentColor"
      d="M880-275 720-435v111l-60-60v-356H304l-60-60h416q24 0 42 18t18 42v215l160-160v410ZM848-27 39-836l42-42L890-69l-42 42ZM484-560Zm-87 82ZM159-800l60 60h-79v520h520v-79l60 60v19q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h19Z"
    />
  </svg>
);

const mediaControllerSelector = ({
  toggleVideo,
  video,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  toggleVideo,
  video,
});

export type VideoToggleProps = {
  /**
   * The callback to trigger any logic on click/press.
   */
  onPress?: () => void;
  /**
   * The "on" icon to be used for the button.
   * @type React.ReactElement
   */
  onIcon?: React.ReactElement;
  /**
   * The "off" icon to be used for the button.
   * @type React.ReactElement
   */
  offIcon?: React.ReactElement;
  /**
   * The size of the icon.
   */
  size?: number | string;
};

export const VideoToggle: React.FC<VideoToggleProps> = (props) => {
  const { toggleVideo, video } = useMediaController(mediaControllerSelector);
  const { onIcon, offIcon, onPress, ...rest } = props;

  const onPressComposed = async () => {
    await onPress?.();
    await toggleVideo();
  };

  const children = useConditionalIcon(
    Boolean(video),
    onIcon,
    <DefaultOnIcon />,
    offIcon,
    <DefaultOffIcon />,
  );

  const title = useMemo(
    () => (video ? "Turn video off (v)" : "Turn video on (v)"),
    [video],
  );

  return (
    <button
      style={{
        width: props.size,
        height: props.size,
      }}
      className={styling.iconButton.button()}
      title={title}
      aria-label={title}
      onClick={onPressComposed}
      {...omit(rest, "size")}
    >
      {children}
    </button>
  );
};
