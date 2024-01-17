import {
  VolumeProps as AudioToggleProps,
  useVolume,
} from "@livepeer/core-react/components";
import { MediaControllerState, omit } from "@livepeer/core-web";
import { styling } from "@livepeer/core-web/media/browser/styling";
import * as React from "react";

import { useMediaController } from "../../../../context";

const DefaultMutedIcon = () => (
  <svg width="100%" height="100%" viewBox="-320 -1270 1600 1600">
    <path
      fill="currentColor"
      d="m686-361-43-43q21-26 31-58.5t10-66.5h60q0 46-15 89t-43 79ZM461-586Zm97 97-53-52v-238q0-17.425-11.788-29.213Q481.425-820 464-820q-17.425 0-29.212 11.787Q423-796.425 423-779v155l-60-60v-95q0-42.083 29.441-71.542Q421.882-880 463.941-880t71.559 29.458Q565-821.083 565-779v250q0 8-1.5 20t-5.5 20ZM434-120v-136q-106-11-178-89t-72-184h60q0 91 64.5 153T464-314q38 0 73.11-12.337Q572.221-338.675 601-361l43 43q-31 26-69.014 41.568Q536.972-260.865 494-256v136h-60Zm397 65L36-850l38-38L869-93l-38 38Z"
    />
  </svg>
);

const DefaultUnmutedIcon = () => (
  <svg width="100%" height="100%" viewBox="-320 -1270 1600 1600">
    <path
      fill="currentColor"
      d="M480-423q-43 0-72-30.917-29-30.916-29-75.083v-251q0-41.667 29.441-70.833Q437.882-880 479.941-880t71.559 29.167Q581-821.667 581-780v251q0 44.167-29 75.083Q523-423 480-423Zm0-228Zm-30 531v-136q-106-11-178-89t-72-184h60q0 91 64.288 153t155.5 62Q571-314 635.5-376 700-438 700-529h60q0 106-72 184t-178 89v136h-60Zm30-363q18 0 29.5-13.5T521-529v-251q0-17-11.788-28.5Q497.425-820 480-820q-17.425 0-29.212 11.5Q439-797 439-780v251q0 19 11.5 32.5T480-483Z"
    />
  </svg>
);

const mediaControllerSelector = ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
  volume,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
  volume,
});

export type { AudioToggleProps };

export const AudioToggle: React.FC<AudioToggleProps> = (props) => {
  const {
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
  } = useMediaController(mediaControllerSelector);

  const { buttonProps, title } = useVolume({
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
    defaultMutedIcon: <DefaultMutedIcon />,
    defaultUnmutedIcon: <DefaultUnmutedIcon />,
    ...props,
  });

  return (
    <div className={styling.volume.container()}>
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
    </div>
  );
};
