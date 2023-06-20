import { addMediaMetricsToStore } from '@livepeer/core-react';
import {
  BroadcastProps as CoreBroadcastProps,
  ObjectFit,
  useBroadcast,
} from '@livepeer/core-react/components';

import * as React from 'react';

import { WebRTCBroadcast } from './WebRTCBroadcast';
import {
  MediaControllerContext,
  MediaControllerProvider,
} from '../../../context';
import {
  Container,
  ControlsContainer,
  FullscreenButton,
  TimeDisplay,
  Title,
} from '../controls';

export type PosterSource = string | React.ReactNode;

type BroadcastProps = CoreBroadcastProps<HTMLMediaElement> & {
  /**
   * The tab index of the container element.
   */
  tabIndex?: number;
};

export type { BroadcastProps, ObjectFit };

export const BroadcastInternal = (props: BroadcastProps) => {
  const {
    mediaElement,
    broadcastProps,
    mediaControllerProps,
    controlsContainerProps,
    props: { children, controls, theme, title, aspectRatio, onBroadcastError },
  } = useBroadcast<HTMLMediaElement>(props);

  const store = React.useContext(MediaControllerContext);

  React.useEffect(() => {
    const { destroy } = addMediaMetricsToStore(store, (e) => {
      onBroadcastError?.(e as Error);
      console.error('Not able to report player metrics', e);
    });

    return destroy;
  }, [onBroadcastError, store]);

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

        {React.isValidElement(children) ? (
          React.cloneElement(children, controlsContainerProps)
        ) : (
          <>
            <ControlsContainer
              {...controlsContainerProps}
              // poster={poster && <Poster content={poster} title={title} />}
              top={<>{title && <Title content={title} />}</>}
              // middle={<Progress />}
              left={
                <>
                  {/* <PlayButton /> */}
                  {/* <Volume /> */}
                  <TimeDisplay />
                </>
              }
              right={
                <>
                  {/* {props.showPipButton && <PictureInPictureButton />} */}
                  <FullscreenButton />
                </>
              }
            />
          </>
        )}
      </Container>
    </MediaControllerProvider>
  );
};

const typedMemo: <T>(c: T) => T = React.memo;
export const Broadcast = typedMemo(BroadcastInternal);
