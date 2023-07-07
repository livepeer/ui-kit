import { MediaControllerState } from 'livepeer';
import { getMediaDevices, getUserMedia } from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { AVSelect } from './AVSelect';
import { useMediaController } from '../../../../context';

const mediaControllerSelector = ({
  deviceIds,
  _updateMediaStream,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  deviceIds,
  _updateMediaStream,
});

export type AudioSourceSelectProps = {
  /**
   * The portal container which is used for the select dropdown.
   * @type React.ReactElement
   */
  portalContainer?: HTMLElement | null | undefined;
  /**
   * The media stream constraints to apply to the requested audio source.
   */
  streamConstraints?: MediaStreamConstraints;
};

export const AudioSourceSelect: React.FC<AudioSourceSelectProps> = ({
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
      setMediaDevices(devices.filter((device) => device.kind === 'audioinput'));
    });

    return destroy;
  }, []);

  const onAudioChange = React.useCallback(
    async (id: string) => {
      const mediaStream = await getUserMedia({
        source: {
          streamConstraints,
          videoDeviceId: deviceIds?.video ?? undefined,
          audioDeviceId: id ?? deviceIds?.audio ?? undefined,
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
      type="audio"
      onChange={onAudioChange}
      value={deviceIds?.audio}
      mediaDevices={mediaDevices ?? []}
      portalContainer={portalContainer}
    />
  );
};
