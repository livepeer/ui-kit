import { MediaControllerState } from "@livepeer/core-web";
import {
  getMediaDevices,
  getUserMedia,
} from "@livepeer/core-web/src/media/browser/webrtc";
import * as React from "react";

import { useMediaController } from "../../../../player/context";
import { AVSelect } from "./AVSelect";

const mediaControllerSelector = ({
  deviceIds,
  _updateMediaStream,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  deviceIds,
  _updateMediaStream,
});

export type VideoSourceSelectProps = {
  /**
   * The portal container which is used for the select dropdown.
   * @type React.ReactElement
   */
  portalContainer?: HTMLElement | null | undefined;
  /**
   * The media stream constraints to apply to the requested video source.
   */
  streamConstraints?: MediaStreamConstraints;
};

export const VideoSourceSelect: React.FC<VideoSourceSelectProps> = ({
  portalContainer,
  streamConstraints,
}) => {
  const { deviceIds, _updateMediaStream } = useMediaController(
    mediaControllerSelector,
  );

  const [mediaDevices, setMediaDevices] = React.useState<
    MediaDeviceInfo[] | null
  >(null);

  React.useEffect(() => {
    const destroy = getMediaDevices((devices) => {
      setMediaDevices(devices.filter((device) => device.kind === "videoinput"));
    });

    return destroy;
  }, []);

  const onVideoChange = React.useCallback(
    async (id: string) => {
      const mediaStream = await getUserMedia({
        source: {
          streamConstraints,
          videoDeviceId: id ?? deviceIds?.video ?? undefined,
          audioDeviceId: deviceIds?.audio ?? undefined,
        },
      });

      if (mediaStream) {
        _updateMediaStream(mediaStream);
      }
    },
    [_updateMediaStream, deviceIds, streamConstraints],
  );

  return (
    <AVSelect
      type="video"
      onChange={onVideoChange}
      value={deviceIds?.video}
      mediaDevices={mediaDevices ?? []}
      portalContainer={portalContainer}
    />
  );
};
