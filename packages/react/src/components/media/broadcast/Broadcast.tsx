import {
  BroadcastProps as CoreBroadcastProps,
  useBroadcast,
} from '@livepeer/core-react/components';

import { MediaControllerCallbackState, ObjectFit } from '@livepeer/core-web';
import * as React from 'react';

import { WebRTCBroadcast } from './WebRTCBroadcast';
import {
  AudioToggle,
  BroadcastSettings,
  Screenshare,
  VideoToggle,
} from './controls';
import { MediaControllerProvider } from '../../../context';
import {
  Container,
  ControlsContainer,
  FullscreenButton,
  PictureInPictureButton,
  TimeDisplay,
  Title,
} from '../controls';

export type PosterSource = string | React.ReactNode;

type BroadcastProps<TSlice> = CoreBroadcastProps<
  HTMLMediaElement,
  MediaStream,
  TSlice
> & {
  /**
   * The tab index of the container element.
   */
  tabIndex?: number;
  /** Whether to show the picture in picture button */
  showPipButton?: boolean;
  /**
   * The display media stream options to use when requesting screen share.
   */
  displayMediaOptions?: DisplayMediaStreamOptions;
  /**
   * The media stream constraints to apply to the requested audio/video sources.
   */
  mediaStreamConstraints?: MediaStreamConstraints;
};

export type { BroadcastProps, ObjectFit };

const BroadcastInternal = <
  TSlice = MediaControllerCallbackState<HTMLMediaElement, MediaStream>,
>(
  props: BroadcastProps<TSlice>,
) => {
  const {
    mediaElement,
    broadcastProps,
    mediaControllerProps,
    controlsContainerProps,
    props: {
      children,
      controls,
      theme,
      title,
      aspectRatio,
      renderChildrenOutsideContainer,
    },
  } = useBroadcast<HTMLMediaElement, MediaStream, TSlice>(props);

  return (
    <MediaControllerProvider
      element={mediaElement}
      opts={controls}
      mediaProps={mediaControllerProps}
    >
      <Container
        theme={theme}
        aspectRatio={aspectRatio}
        tabIndex={props.tabIndex}
      >
        <WebRTCBroadcast {...broadcastProps} />

        {!renderChildrenOutsideContainer && React.isValidElement(children) ? (
          React.cloneElement(children, controlsContainerProps)
        ) : (
          <ControlsContainer
            {...controlsContainerProps}
            top={<>{title && <Title content={title} />}</>}
            left={
              <>
                <VideoToggle />
                <AudioToggle />
                <Screenshare options={props?.displayMediaOptions} />
                <TimeDisplay />
              </>
            }
            right={
              <>
                {props.showPipButton && <PictureInPictureButton />}
                <BroadcastSettings
                  streamConstraints={props.mediaStreamConstraints}
                />
                <FullscreenButton />
              </>
            }
          />
        )}
      </Container>
      {renderChildrenOutsideContainer && React.isValidElement(children) ? (
        children
      ) : (
        <></>
      )}
    </MediaControllerProvider>
  );
};

const typedMemo: <T>(c: T) => T = React.memo;
export const Broadcast = typedMemo(BroadcastInternal);
