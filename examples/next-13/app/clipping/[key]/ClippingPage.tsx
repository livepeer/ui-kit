'use client';

import { Button, Label, TextField } from '@livepeer/design-system';
import {
  MediaControllerCallbackState,
  Player,
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

export default (props: ClippingPageProps) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  const [clipPlaybackId, setClipPlaybackId] = useState<string | null>(null);

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
    if (clipAsset) {
      setOpen(false);
      window?.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setClipPlaybackId(clipAsset?.playbackId ?? null);
        setOpen(true);
      }, 100);

      return () => window?.clearTimeout(timerRef.current);
    }
  }, [clipAsset]);

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
        <ToastTitle>Livestream clipped</ToastTitle>
        <ToastDescription>Your clip has been created.</ToastDescription>
        <ToastAction asChild altText="Open clip in new tab">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/?v=${clipPlaybackId ?? ''}`}
          >
            <Button size="1">Open in new tab</Button>
          </a>
        </ToastAction>
      </ToastRoot>
      <ToastViewport />
    </ToastProvider>
  );
};
