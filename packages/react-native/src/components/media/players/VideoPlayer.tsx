import {
  AVPlaybackStatus,
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  ResizeMode,
  Video,
} from 'expo-av';
import {
  ControlsOptions,
  MediaControllerState,
  MediaControllerStore,
  VideoSrc,
} from 'livepeer/media';

import { DEFAULT_VOLUME_LEVEL } from 'livepeer/src/media/core/controller';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native';

import { StoreApi, UseBoundStore } from 'zustand';

import { MediaControllerContext } from '../../../context';
import { MediaElement } from '../types';
import { HlsPlayerProps } from './HlsPlayer';
import { canPlayMediaNatively } from './canPlayMediaNatively';

const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls

export type VideoPlayerProps = Omit<HlsPlayerProps, 'src'> & {
  src: VideoSrc[] | null;
};

export const VideoPlayer = forwardRef<Video, VideoPlayerProps>(
  ({ src, autoPlay, loop, muted, objectFit, options }, ref) => {
    // typecast the context so that we can have video/audio-specific controller states
    const store = useContext(MediaControllerContext) as UseBoundStore<
      MediaControllerStore<MediaElement>
    >;

    // useEffect(() => {
    //   Audio.setAudioModeAsync({
    //     allowsRecordingIOS: true,
    //     playsInSilentModeIOS: true,
    //     interruptionModeIOS: InterruptionModeIOS.DuckOthers,
    //     interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    //     staysActiveInBackground: true,
    //     shouldDuckAndroid: true,
    //     playThroughEarpieceAndroid: true,
    //   });
    // }, []);

    const { hasPlayed, playing } = store();

    // const onError = async (e: string) => {
    //   store.getState().setError(e);
    //   // await new Promise((r) => setTimeout(r, 1000 * ++retryCount));
    //   // await state._element?.unloadAsync();
    //   // TODO add error handling
    // };

    useEffect(() => {
      const removeEffectsFromStore = addEffectsToStore(
        store,
        store.getState()._element,
        { autohide: options?.autohide ?? DEFAULT_AUTOHIDE_TIME },
      );

      return () => {
        removeEffectsFromStore?.();
      };
    }, [store, options?.autohide]);

    const filteredSources = useMemo(() => {
      return src?.filter((s) => s?.mime && canPlayMediaNatively(s));
    }, [src]);

    const onPlaybackStatusUpdate = useCallback(
      async (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          store.setState({
            volume: status.volume,
            canPlay: true,
            playing: status.isPlaying,
            progress: status.positionMillis / 1000,
            duration: (status.durationMillis ?? 0) / 1000,
            muted: status.isMuted,
            playbackRate: status.rate,
            buffered: (status.playableDurationMillis ?? 0) / 1000,

            // double check this
            stalled: status.shouldPlay && !status.isPlaying,
            waiting: status.isBuffering,
          });
        } else {
          store.setState({
            loading: !status.error,
            error: status.error,
            canPlay: false,
          });
        }
      },
      [store],
    );

    return (
      <Video
        source={{ uri: filteredSources?.[0]?.src ?? '' }}
        style={styles.videoWrapper}
        isLooping={loop}
        resizeMode={
          objectFit === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER
        }
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        // onError={onError}
        shouldPlay={hasPlayed ? playing : autoPlay}
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

const _addEventListeners = <TElement extends MediaElement>(
  store: MediaControllerStore<TElement>,
  { autohide = DEFAULT_AUTOHIDE_TIME }: ControlsOptions = {},
) => {
  const element = store?.getState()?._element;

  // const initializedState = store.getState();

  // restore the persisted values from store
  if (element) {
    // await element.setVolumeAsync(initializedState.volume);
  }

  // const onTouchUpdate = async () => {
  //   store.getState()._updateLastInteraction();
  // };

  // let retryCount = 0;

  // const onError = async (e: ErrorEvent) => {
  //   store.getState().setError(e.message);
  //   await new Promise((r) => setTimeout(r, 1000 * ++retryCount));
  //   await element?.unloadAsync();
  //   // TODO add error handling
  // };

  // const onWaiting = async () => {
  //   store.getState().setWaiting(true);
  // };

  // const onStalled = async () => {
  //   store.getState().setStalled(true);
  // };

  // add effects
  const removeEffectsFromStore = addEffectsToStore(store, element, {
    autohide,
  });

  return {
    destroy: () => {
      removeEffectsFromStore?.();

      store?.destroy?.();
    },
  };
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
            previousPromise = element.playAsync();
          } else {
            previousPromise = element.pauseAsync();
          }
        }

        if (current.volume !== prev.volume) {
          previousPromise = element.setVolumeAsync(current.volume);
        }

        if (current.muted !== prev.muted) {
          previousPromise = element.setIsMutedAsync(current.muted);
          if (current.volume === 0) {
            previousPromise = element.setVolumeAsync(DEFAULT_VOLUME_LEVEL);
          }
        }

        if (current._requestedRangeToSeekTo !== prev._requestedRangeToSeekTo) {
          previousPromise = element.setPositionAsync(
            current._requestedRangeToSeekTo,
          );
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

        // if (
        //   current._requestedPictureInPictureLastTime !==
        //   prev._requestedPictureInPictureLastTime
        // ) {
        //   const isPictureInPicture = isCurrentlyPictureInPicture(element);

        //   if (!isPictureInPicture) {
        //     previousPromise = element.pip
        //   } else {
        //     previousPromise = exitPictureInPicture(element);
        //   }
        // }
      }
    } catch (e) {
      console.warn(e);
    }
  });
};
