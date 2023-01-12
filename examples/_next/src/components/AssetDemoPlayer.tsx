import { Player } from '@livepeer/react';
import { useCallback } from 'react';

// const playbackId = 'ipfs://bafybeifavmtea3u5ulvrkdzc2wnjwjl35jefqiyhgruxu2cjd4kumymqm4'; // ipfs asset
const playbackId = 'd29f52w8s55dw8gw'; // asset
// const playbackId = '1dd6omrqq7htwgig'; // public stream
// const playbackId = '0b3a57ekt0n6ie08'; // gated stream
// const playbackId = '740c7a3g4ipyur5g'; // gated stream

export const AssetDemoPlayer = () => {
  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    console.log('Media duration', ref.duration);
  }, []);

  return (
    <>
      {/* Added scrolling to test priority... */}
      {/* <div style={{ height: 2000 }} /> */}
      <Player
        playbackId={playbackId}
        // src={playbackId}
        // src={'/audio-example.mp3'}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: 'https://lens.infura-ipfs.io/',
        }}
        // priority
        loop
        autoPlay
        showPipButton
        // muted
        mediaElementRef={mediaElementRef}
        controls={{
          defaultVolume: 0.7,
        }}
        theme={{
          fonts: {
            display: 'Inter',
          },
          colors: {
            accent: '#72DDF7',
            progressLeft: '#F7AEF8',
            progressMiddle: '#F7AEF8',
            progressRight: '#F7AEF8',
            progressThumb: '#F4F4ED',
          },
          // radii: { containerBorderRadius: '30px' },
          // space: {
          //   controlsTopMarginX: '20px',
          //   controlsTopMarginY: '15px',
          //   controlsBottomMarginX: '15px',
          //   controlsBottomMarginY: '10px',
          // },
        }}
      />
    </>
  );
};
