import { Player } from '@livepeer/react';

const playbackId = '6d7el73r1y12chxr';
// const streamId = '2c61917e-4f05-449a-ab7d-1b3c85f78993';

export const AssetDemoPlayer = () => {
  return (
    <>
      <Player
        playbackId={playbackId}
        // src={'/audio-example.mp3'}
        loop
        autoPlay
        showPictureInPictureButton
        muted
        theme={{
          fonts: {
            display: 'Inter',
          },
          radii: { containerBorderRadius: '30px' },
          space: {
            controlsTopMarginX: '20px',
            controlsTopMarginY: '15px',
            controlsBottomMarginX: '15px',
            controlsBottomMarginY: '10px',
          },
        }}
      />
    </>
  );
};
