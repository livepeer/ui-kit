// polyfill for URL
import 'react-native-url-polyfill/auto';

import {
  ControlsOptions,
  DEFAULT_AUTOHIDE_TIME,
  MediaControllerState,
  addMediaMetricsToStore,
} from '@livepeer/core-react';
import { VideoPlayerProps as VideoPlayerCoreProps } from '@livepeer/core-react/components';
import {
  AVPlaybackStatus,
  Audio,
  AudioMode,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  ResizeMode,
  Video,
  VideoFullscreenUpdate,
  VideoFullscreenUpdateEvent,
} from 'expo-av';
import * as React from 'react';

import { StyleSheet } from 'react-native';

import { StoreApi, useStore } from 'zustand';

import { canPlayMediaNatively } from './canPlayMediaNatively';
import { MediaControllerContext } from '../../../context';
import { PosterSource } from '../Player';
import { MediaElement } from '../types';

const defaultProgressUpdateInterval = 100;

export type VideoPlayerProps = VideoPlayerCoreProps<
  MediaElement,
  PosterSource
> &
  VideoCustomizationProps;

export type VideoCustomizationProps = {
  audioMode?: Partial<AudioMode>;
};

export const VideoPlayer = React.forwardRef<MediaElement, VideoPlayerProps>(
  (
    {
      src,
      autoPlay,
      loop,
      objectFit,
      options,
      poster,
      audioMode,
      onMetricsError,
      onError,
      isCurrentlyShown,
    },
    ref,
  ) => {
    const context = React.useContext(MediaControllerContext);
    const store = useStore(context);

    React.useEffect(() => {
      Audio.setAudioModeAsync({
        ...audioMode,
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true,
      });
    }, [audioMode]);

    const { muted } = store;

    const shouldPlay = React.useMemo(
      () => (autoPlay ? isCurrentlyShown : false),
      [autoPlay, isCurrentlyShown],
    );

    React.useEffect(() => {
      const removeEffectsFromStore = addEffectsToStore(
        context,
        context.getState()._element,
        { autohide: options?.autohide ?? DEFAULT_AUTOHIDE_TIME },
      );

      return () => {
        removeEffectsFromStore?.();
      };
    }, [context, options?.autohide]);

    const filteredSources = React.useMemo(() => {
      return src?.filter((s) => s?.mime && canPlayMediaNatively(s));
    }, [src]);

    React.useEffect(() => {
      const { destroy } = addMediaMetricsToStore(
        context,
        filteredSources?.[0]?.src,
        (e) => {
          onMetricsError?.(e as Error);
          console.error('Not able to report player metrics', e);
        },
      );

      return destroy;
    }, [onMetricsError, context, filteredSources]);

    const onPlaybackStatusUpdate = React.useCallback(
      async (status?: AVPlaybackStatus) => {
        if (status?.isLoaded) {
          context.setState(({ buffered, duration, hasPlayed }) => ({
            hasPlayed: hasPlayed || status.positionMillis > 0,
            volume: 1,
            canPlay: true,
            playing: status.isPlaying,
            progress: status.positionMillis / 1000,
            duration: status.durationMillis
              ? status.durationMillis / 1000
              : duration,
            playbackRate: status.rate,
            buffered: status.playableDurationMillis
              ? status.playableDurationMillis / 1000
              : buffered,

            live: !status.durationMillis,

            isVolumeChangeSupported: true,

            stalled: status.shouldPlay && !status.isPlaying,
            waiting: status.isBuffering,
          }));
        } else if (status) {
          context.setState({
            loading: !status.error,
            error: status.error,
            canPlay: false,
          });
        }
      },
      [context],
    );

    const onFullscreenUpdate = React.useCallback(
      async (status?: VideoFullscreenUpdateEvent) => {
        context.setState(() => ({
          fullscreen:
            status?.fullscreenUpdate !==
            VideoFullscreenUpdate.PLAYER_DID_DISMISS,
        }));
      },
      [context],
    );

    return (
      <Video
        source={
          filteredSources?.[0]?.src
            ? { uri: filteredSources[0].src }
            : undefined
        }
        style={styles.videoWrapper}
        isLooping={loop}
        resizeMode={
          objectFit === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER
        }
        usePoster={Boolean(poster)}
        posterSource={poster}
        // eslint-disable-next-line react-native/no-inline-styles
        posterStyle={{
          resizeMode: objectFit === 'contain' ? 'contain' : 'cover',
        }}
        useNativeControls={false}
        progressUpdateIntervalMillis={defaultProgressUpdateInterval}
        onFullscreenUpdate={onFullscreenUpdate}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onError={(err) => onError?.(new Error(err))}
        shouldPlay={shouldPlay}
        ref={ref}
        isMuted={muted}
      />
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

export const styles = StyleSheet.create({
  videoWrapper: {
    height: '100%',
    width: '100%',
  },
});

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let previousPromise: Promise<any> | boolean | null;

const addEffectsToStore = <TElement extends MediaElement>(
  store: StoreApi<MediaControllerState<TElement>>,
  element: MediaElement | null,
  options: Required<Pick<ControlsOptions, 'autohide'>>,
) => {
  // add effects to store changes
  return store.subscribe(async (current, prev) => {
    try {
      if (element) {
        if (previousPromise) {
          try {
            // wait for the previous promise to execute before handling the next effect
            await previousPromise;
          } catch (e) {
            console.warn(e);
          }
        }

        if (
          current._requestedPlayPauseLastTime !==
          prev._requestedPlayPauseLastTime
        ) {
          if (!current.playing) {
            if (current.progress >= current.duration) {
              previousPromise = element.playFromPositionAsync(0);
            } else {
              previousPromise = element.playAsync();
            }
          } else {
            previousPromise = element.pauseAsync();
          }
        }

        if (current.muted !== prev.muted) {
          previousPromise = element.setIsMutedAsync(current.muted);
          if (!current.muted) {
            previousPromise = element.setVolumeAsync(1);
          }
        }

        if (current._requestedRangeToSeekTo !== prev._requestedRangeToSeekTo) {
          previousPromise = element.setStatusAsync({
            positionMillis: current._requestedRangeToSeekTo * 1000, // convert to ms
          });
        }

        // user has interacted with element
        if (
          options.autohide &&
          current._lastInteraction !== prev._lastInteraction
        ) {
          await delay(options.autohide);

          if (
            !store.getState().hidden &&
            current._lastInteraction === store.getState()._lastInteraction
          ) {
            store.getState().setHidden(true);
          }
        }

        if (
          current._requestedFullscreenLastTime !==
          prev._requestedFullscreenLastTime
        ) {
          const isFullscreen = current.fullscreen;

          if (!isFullscreen) {
            previousPromise = element.presentFullscreenPlayer();
          } else {
            previousPromise = element.dismissFullscreenPlayer();
          }
        }
      }
    } catch (e) {
      console.warn(e);
    }
  });
};
