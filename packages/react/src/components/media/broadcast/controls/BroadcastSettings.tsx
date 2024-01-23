import { MediaControllerState, omit } from "@livepeer/core-web";
import { styling } from "@livepeer/core-web/media/browser/styling";
import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";

import { useMediaController } from "../../../../player/context";
import { AudioSourceSelect } from "./AudioSourceSelect";
import { VideoSourceSelect } from "./VideoSourceSelect";

const DefaultSettingsIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 36 36">
    <path
      d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z"
      fill="currentColor"
    ></path>
  </svg>
);

const mediaControllerSelector = ({
  _element,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  _element,
});

export type BroadcastSettingsProps = {
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
   * The media stream constraints to apply to the requested audio/video sources.
   */
  streamConstraints?: MediaStreamConstraints;
};

export const BroadcastSettings: React.FC<BroadcastSettingsProps> = (props) => {
  const { _element } = useMediaController(mediaControllerSelector);

  return (
    <div className={styling.volume.container()}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            style={{
              width: props.size,
              height: props.size,
            }}
            className={styling.iconButton.button()}
            title="Broadcast settings"
            aria-label="Broadcast settings"
            {...omit(props, "icon", "size", "streamConstraints")}
          >
            {props?.icon ?? <DefaultSettingsIcon />}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal container={_element?.parentElement ?? _element}>
          <Dialog.Overlay className={styling.settings.overlay()} />
          <Dialog.Content className={styling.settings.content()}>
            <Dialog.Title className={styling.settings.title()}>
              Settings
            </Dialog.Title>
            <VideoSourceSelect
              streamConstraints={props.streamConstraints}
              portalContainer={_element?.parentElement ?? _element}
            />
            <AudioSourceSelect
              streamConstraints={props.streamConstraints}
              portalContainer={_element?.parentElement ?? _element}
            />
            <Dialog.Close asChild>
              <button className={styling.settings.close()} aria-label="Close">
                <CloseIcon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="48"
    viewBox="0 -960 960 960"
    width="48"
  >
    <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
  </svg>
);
