'use client';

import { Button, Label, TextField } from '@livepeer/design-system';
import {
  MediaControllerCallbackState,
  Player,
  useCreateClip,
  usePlaybackInfo,
} from '@livepeer/react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '../../../toast';

export type ClippingPageProps = {
  playbackId: string;
  sessionId?: string;
};

const hlsConfig = {
  liveSyncDurationCount: Infinity,
};

type PlaybackStatus = {
  progress: number;
  offset: number;
};

type PlaybackStartEnd = {
  displayTime: string;
  unix: number;
};

export default (props: ClippingPageProps) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  const playerProps = useMemo(
    () =>
      props.sessionId
        ? {
            src: `https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/${props.playbackId}/${props.sessionId}/output.m3u8`,
            playRecording: true,
          }
        : {
            playbackId: props.playbackId,
          },
    [props],
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null,
  );

  const playbackStatusSelector = useCallback(
    (state: MediaControllerCallbackState<HTMLMediaElement, never>) => ({
      progress: Number(state.progress.toFixed(1)),
      offset: Number(state.playbackOffsetMs?.toFixed(1) ?? 0),
    }),
    [],
  );

  const onPlaybackStatusUpdate = useCallback(
    (state: { progress: number; offset: number }) => setPlaybackStatus(state),
    [],
  );

  const onError = useCallback((error: Error) => console.log(error), []);

  const [startTime, setStartTime] = useState<PlaybackStartEnd | null>(null);
  const [endTime, setEndTime] = useState<PlaybackStartEnd | null>(null);

  const {
    data: clipAsset,
    mutate,
    isLoading,
  } = useCreateClip({
    sessionId: props.sessionId,
    playbackId: props.playbackId,
    startTime: startTime?.unix ?? 0,
    endTime: endTime?.unix ?? 0,
  });

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { data: clipPlaybackInfo } = usePlaybackInfo({
    playbackId: clipAsset?.playbackId ?? undefined,
    refetchInterval: (info) =>
      !info?.meta?.source?.some((s) => s.hrn === 'MP4') ? 2000 : false,
  });

  const mp4DownloadUrl = useMemo(
    () =>
      clipPlaybackInfo?.meta?.source
        ?.sort((a, b) => {
          const sizeA = a?.size ?? 0;
          const sizeB = b?.size ?? 0;

          return sizeB - sizeA;
        })
        ?.find((s) => s.hrn === 'MP4')?.url ?? null,
    [clipPlaybackInfo],
  );

  useEffect(() => {
    if (isLoading) {
      setOpen(false);
      window?.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
    }
  }, [isLoading]);

  useEffect(() => {
    if (mp4DownloadUrl) {
      setOpen(false);
      window?.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
    }
  }, [mp4DownloadUrl]);

  return (
    <ToastProvider>
      <div
        style={{
          margin: '16px 20px',
          maxWidth: 800,
        }}
      >
        <div
          style={{
            position: 'relative',
          }}
        >
          <Player
            {...playerProps}
            autoPlay
            muted
            playbackStatusSelector={playbackStatusSelector}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onError={onError}
            hlsConfig={hlsConfig}
          />
          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <Button
              onClick={() => {
                const progress = playbackStatus?.progress;
                const offset = playbackStatus?.offset;

                if (progress && offset) {
                  const calculatedTime = Date.now() - offset;

                  if (!startTime) {
                    setStartTime({
                      unix: calculatedTime,
                      displayTime: progress.toFixed(0).toString(),
                    });
                  } else if (!endTime) {
                    setEndTime({
                      unix: calculatedTime,
                      displayTime: progress.toFixed(0).toString(),
                    });
                  } else {
                    setStartTime(null);
                    setEndTime(null);
                  }
                }
              }}
            >
              {!startTime
                ? 'Set clip start time'
                : !endTime
                ? 'Set clip end time'
                : 'Reset'}
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <div style={{ flex: 1 }}>
            <Label>Start time (seconds)</Label>
            <TextField
              name="start"
              type="number"
              disabled
              value={startTime?.displayTime ?? ''}
              step={0.1}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>End time (seconds)</Label>
            <TextField
              name="end"
              type="number"
              disabled
              value={endTime?.displayTime ?? ''}
              step={0.1}
            />
          </div>
        </div>

        <div
          style={{
            float: 'right',
            marginTop: '10px',
          }}
        >
          <Button
            onClick={mutate}
            disabled={!startTime || !endTime || isLoading}
          >
            Create clip
          </Button>
        </div>
      </div>
      <ToastRoot open={open} onOpenChange={setOpen}>
        <ToastTitle>
          {!mp4DownloadUrl ? 'Clip loading' : 'Livestream clipped'}
        </ToastTitle>
        <ToastDescription>
          {!mp4DownloadUrl
            ? 'Your clip is being processed in the background...'
            : 'Your clip has been created.'}
        </ToastDescription>
        {mp4DownloadUrl && (
          <ToastAction asChild altText="Download clip">
            <a target="_blank" rel="noopener noreferrer" href={mp4DownloadUrl}>
              <Button size="1">Download clip</Button>
            </a>
          </ToastAction>
        )}
      </ToastRoot>
      <ToastViewport />
    </ToastProvider>
  );
};
