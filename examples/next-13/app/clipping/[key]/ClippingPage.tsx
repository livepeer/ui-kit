'use client';

import { Button, Label, TextField } from '@livepeer/design-system';
import { Player } from '@livepeer/react';

import { useState } from 'react';

import { SubmitButton } from './SubmitButton';
import { createClip } from './actions';

export type ClippingPageProps = {
  playbackId: string;
};

export default (props: ClippingPageProps) => {
  const [playbackStatus, setPlaybackStatus] = useState<{
    duration: number;
    progress: number;
  } | null>(null);

  return (
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
          src={`https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/806dk46k6ba0dv3m/685269ea-42ba-4752-9851-9391bc103df3/output.m3u8`}
          playbackStatusSelector={(state) => ({
            duration: Number(state.duration.toFixed(1)),
            progress: Number(state.progress.toFixed(1)),
          })}
          onPlaybackStatusUpdate={(state) => setPlaybackStatus(state)}
        />
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <Button
            onClick={() => {
              const progress = playbackStatus?.progress?.toString?.();
              if (
                typeof navigator !== 'undefined' &&
                navigator?.clipboard &&
                progress
              ) {
                navigator?.clipboard?.writeText(progress);
              }
            }}
          >
            Copy current position
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
              placeholder="12.4"
              step={0.1}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>End time (seconds)</Label>
            <TextField name="end" type="number" placeholder="28.1" step={0.1} />
          </div>

          <input type="hidden" value={props.playbackId} name="playbackId" />
        </div>

        <div
          style={{
            float: 'right',
            marginTop: '10px',
          }}
        >
          <SubmitButton>Create clip</SubmitButton>
        </div>
      </form>
    </div>
  );
};
