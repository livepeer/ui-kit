'use client';

import { Button, Label, TextField } from '@livepeer/design-system';
import {
  MediaControllerCallbackState,
  Player,
  useAsset,
  useCreateClip,
} from '@livepeer/react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { SubmitButton } from './SubmitButton';
import { createClip } from './actions';
import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '../../toast';

export type ClippingPageProps = {
  playbackId: string;
};

const hlsConfig = {
  liveSyncDurationCount: Number.MAX_VALUE - 10,
};

export default (props: ClippingPageProps) => {
  const [open, setOpen] = useState(false);
  const [clipDownloadUrl, setClipDownloadUrl] = useState<string | null>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [playbackStatus, setPlaybackStatus] = useState<{
    duration: number;
    progress: number;
  } | null>(null);

  const playbackStatusSelector = useCallback(
    (state: MediaControllerCallbackState<HTMLMediaElement, never>) => ({
      duration: Number(state.duration.toFixed(1)),
      progress: Number(state.progress.toFixed(1)),
    }),
    [],
  );

  const onPlaybackStatusUpdate = useCallback(
    (state: { duration: number; progress: number }) => setPlaybackStatus(state),
    [],
  );

  const onError = useCallback((error: Error) => console.log(error), []);

  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const {
    data: clipAsset,
    mutate,
    isLoading,
  } = useCreateClip({
    playbackId: props.playbackId,
    startTime: (Number(startTime) ?? 0) * 1000,
    endTime: (Number(endTime) ?? 0) * 1000,
  });

  useEffect(() => {
    if (isLoading) {
      setStartTime(null);
      setEndTime(null);
      setOpen(false);
      window?.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
    }
  }, [isLoading]);

  const { data: clippedAsset } = useAsset({
    assetId: clipAsset?.id ?? undefined,
    refetchInterval: (asset) => (!asset?.downloadUrl ? 2000 : false),
  });

  useEffect(() => {
    if (clippedAsset?.downloadUrl) {
      setOpen(false);
      window?.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setClipDownloadUrl(clippedAsset.downloadUrl ?? null);
        setOpen(true);
      }, 100);
    }
  }, [clippedAsset]);

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
            autoPlay
            playRecording
            muted
            playbackId={props.playbackId}
            playbackStatusSelector={playbackStatusSelector}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onError={onError}
            hlsConfig={hlsConfig}
          />
          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <Button
              onClick={() => {
                const progress = playbackStatus?.progress?.toString?.();

                if (progress) {
                  if (!startTime) {
                    setStartTime(progress);
                  } else if (!endTime) {
                    setEndTime(progress);
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

        <form action={createClip}>
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
                value={startTime ?? ''}
                step={0.1}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>End time (seconds)</Label>
              <TextField
                name="end"
                type="number"
                disabled
                value={endTime ?? ''}
                step={0.1}
              />
            </div>

            <input type="hidden" value={props.playbackId} name="playbackId" />
          </div>

          <div
            style={{
              float: 'right',
              marginTop: '10px',
            }}
          >
            <SubmitButton
              onClick={mutate}
              disabled={!startTime || !endTime || isLoading}
            >
              Create clip
            </SubmitButton>
          </div>
        </form>
      </div>
      <ToastRoot open={open} onOpenChange={setOpen}>
        <ToastTitle>
          {!clipDownloadUrl ? 'Clip loading' : 'Livestream clipped'}
        </ToastTitle>
        <ToastDescription>
          {!clipDownloadUrl
            ? 'Your clip is being processed in the background...'
            : 'Your clip has been created.'}
        </ToastDescription>
        {clipDownloadUrl && (
          <ToastAction asChild altText="Download clip">
            <a target="_blank" rel="noopener noreferrer" href={clipDownloadUrl}>
              <Button size="1">Download clip</Button>
            </a>
          </ToastAction>
        )}
      </ToastRoot>
      <ToastViewport />
    </ToastProvider>
  );
};
