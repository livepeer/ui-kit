import { MediaControllerState, omit } from "@livepeer/core-web";

import { styling } from "@livepeer/core-web/media/browser/styling";
import { getDisplayMedia } from "@livepeer/core-web/src/media/browser/webrtc";
import React, { useCallback } from "react";

import { useMediaController } from "../../../../player/context";

const DefaultScreenshareIcon = () => (
  <svg width="100%" height="100%" viewBox="-340 -1265 1600 1600">
    <path
      fill="currentColor"
      d="M451-328h59v-194l79 81 43-43-153-152-152 152 43 43 81-81v194ZM140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680v-520H140v520Zm0 0v-520 520Z"
    />
  </svg>
);

const mediaControllerSelector = ({
  _updateMediaStream,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  _updateMediaStream,
});

export type ScreenshareProps = {
  /**
   * The icon to be used for the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement;
  /**
   * The size of the icon.
   */
  size?: number | string;
  /**
   * The display media stream options to use when requesting screen share.
   */
  options?: DisplayMediaStreamOptions;
};

export const Screenshare: React.FC<ScreenshareProps> = (props) => {
  const { _updateMediaStream } = useMediaController(mediaControllerSelector);

  const onPressComposed = useCallback(async () => {
    const mediaStream = await getDisplayMedia(props?.options);

    if (mediaStream) {
      _updateMediaStream(mediaStream);
    }
  }, [_updateMediaStream, props?.options]);

  return (
    <button
      style={{
        width: props.size,
        height: props.size,
      }}
      className={styling.iconButton.button()}
      title="Screen share"
      aria-label="Screen share"
      {...omit(props, "icon", "options", "size")}
      onClick={onPressComposed}
    >
      {props?.icon ?? <DefaultScreenshareIcon />}
    </button>
  );
};
