import { Player } from '@livepeer/react';
import { useCallback } from 'react';

// const playbackId = 'ipfs://bafybeifavmtea3u5ulvrkdzc2wnjwjl35jefqiyhgruxu2cjd4kumymqm4'; // ipfs asset
// const playbackId = 'd29f52w8s55dw8gw'; // asset
// const playbackId = '1dd6omrqq7htwgig'; // public stream
const playbackId = '0b3a57ekt0n6ie08'; // gated stream
// const playbackId = '740c7a3g4ipyur5g'; // gated stream

export const AssetDemoPlayer = () => {
  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    console.log('Media duration', ref.duration);
  }, []);

  return (
    <>
      <Player
        playbackId={playbackId}
        // src={playbackId}
        // src={'/audio-example.mp3'}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: 'https://lens.infura-ipfs.io/',
        }}
        loop
        autoPlay
        showPipButton
        muted
        mediaElementRef={mediaElementRef}
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
