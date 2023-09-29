import {
  PlayerProps as CorePlayerProps,
  ObjectFit,
  usePlayer,
} from '@livepeer/core-react/components';
import {
  AudioSrc,
  Base64Src,
  HlsSrc,
  MediaControllerCallbackState,
  VideoSrc,
  WebRTCSrc,
} from 'livepeer/media';
import { ControlsOptions } from 'livepeer/media/browser';

import { HlsVideoConfig } from 'livepeer/media/browser/hls';
import { WebRTCVideoConfig } from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { AudioPlayer } from '.';
import { ClipButton, PlayButton, Poster, Progress, Volume } from './controls';
import { VideoPlayer } from './video';
import { MediaControllerProvider } from '../../../context';
import { useIsElementShown } from '../../useIsElementShown';
import {
  Container,
  ControlsContainer,
  FullscreenButton,
  PictureInPictureButton,
  TimeDisplay,
  Title,
} from '../controls';

export type PosterSource = string | React.ReactNode;

type PlayerProps<
  TPlaybackPolicyObject extends object,
  TSlice,
> = CorePlayerProps<
  HTMLMediaElement,
  PosterSource,
  TPlaybackPolicyObject,
  TSlice
> & {
  /** Whether to show the picture in picture button (web only) */
  showPipButton?: boolean;
  /** Configuration for the event listeners */
  controls?: ControlsOptions;
  /** Configuration for the HLS.js instance used for HLS playback */
  hlsConfig?: HlsVideoConfig;
  /**
   * Whether low latency is enabled for live-streaming.
   * `force` can be passed to force the use of WebRTC low latency playback,
   * and disable fallback to HLS if WebRTC cannot be used.
   *
   * Defaults to `true`.
   */
  lowLatency?: boolean | 'force';
  /** Configuration for the WebRTC playback */
  webrtcConfig?: WebRTCVideoConfig;
  /**
   * Whether to include credentials in cross-origin requests made from the Player.
   * This is typically used to have the Player include cookies for requests made to Livepeer
   * domains, for access control policies.
   */
  allowCrossOriginCredentials?: boolean;
  /**
   * The tab index of the container element.
   */
  tabIndex?: number;
};

export type { ObjectFit, PlayerProps };

export const PlayerInternal = <TPlaybackPolicyObject extends object, TSlice>(
  props: PlayerProps<TPlaybackPolicyObject, TSlice>,
) => {
  const [isCurrentlyShown, setIsCurrentlyShown] = React.useState(false);

  const screenWidth = React.useMemo(
    () =>
      typeof window !== 'undefined'
        ? (window?.screen?.availWidth || window?.innerWidth) ?? null
        : null,
    [],
  );

  const isCurrentlyShownCombined = React.useMemo(
    () => props._isCurrentlyShown ?? isCurrentlyShown,
    [props._isCurrentlyShown, isCurrentlyShown],
  );

  const {
    mediaElement,
    playerProps,
    mediaControllerProps,
    controlsContainerProps,
    source,
    props: {
      children,
      controls,
      theme,
      title,
      poster,
      showTitle,
      aspectRatio,
      renderChildrenOutsideContainer,
    },
  } = usePlayer<HTMLMediaElement, PosterSource, TPlaybackPolicyObject, TSlice>(
    {
      ...props,
      _isCurrentlyShown: isCurrentlyShownCombined,
    },
    {
      _screenWidth: screenWidth,
    },
  );

  const _isCurrentlyShown = useIsElementShown(mediaElement);

  React.useEffect(() => {
    setIsCurrentlyShown(_isCurrentlyShown);
  }, [_isCurrentlyShown]);

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
        {source && source?.[0]?.type === 'audio' ? (
          <AudioPlayer
            {...playerProps}
            src={source as AudioSrc[]}
            allowCrossOriginCredentials={props.allowCrossOriginCredentials}
          />
        ) : (
          <VideoPlayer
            {...playerProps}
            hlsConfig={props.hlsConfig}
            webrtcConfig={props.webrtcConfig}
            lowLatency={props.lowLatency}
            playbackStatusSelector={
              props.playbackStatusSelector as unknown as (
                state: MediaControllerCallbackState<HTMLVideoElement, never>,
              ) => MediaControllerCallbackState<HTMLVideoElement, never>
            }
            allowCrossOriginCredentials={props.allowCrossOriginCredentials}
            src={source as (VideoSrc | HlsSrc | Base64Src | WebRTCSrc)[] | null}
          />
        )}

        {!renderChildrenOutsideContainer && React.isValidElement(children) ? (
          React.cloneElement(children, controlsContainerProps)
        ) : (
          <ControlsContainer
            {...controlsContainerProps}
            poster={poster && <Poster content={poster} title={title} />}
            top={<>{title && showTitle && <Title content={title} />}</>}
            middle={<Progress />}
            left={
              <>
                <PlayButton />
                <Volume />
                <TimeDisplay />
              </>
            }
            right={
              <>
                {props.clipLength && <ClipButton length={props.clipLength} />}
                {props.showPipButton && <PictureInPictureButton />}
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
export const Player = typedMemo(PlayerInternal);
