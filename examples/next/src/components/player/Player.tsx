import { ControlsContainer, Player as LivepeerPlayer } from '@livepeer/react';

import { BottomControls } from './BottomControls';
import { PlayButton } from './PlayButton';

export const Player = ({ playbackId }: { playbackId: string }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <LivepeerPlayer
        objectFit="contain"
        playbackId={playbackId}
        muted
        theme={{
          colors: {
            accent: '#fff',
          },
          sizes: {
            thumb: '15px',
            thumbActive: '15px',
            trackActive: '4px',
            trackInactive: '4px',
          },
          radii: {
            containerBorderRadius: '0px',
          },
        }}
        controls={{
          autohide: 1000,
        }}
      >
        <ControlsContainer>
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              width: '100%',
              height: '100%',
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PlayButton size={150} />
          </div>
          <BottomControls />
        </ControlsContainer>
      </LivepeerPlayer>
    </div>
  );
};
