import { Player } from '@livepeer/react';
import { useCallback } from 'react';

const playbackId =
  'ipfs://bafybeifavmtea3u5ulvrkdzc2wnjwjl35jefqiyhgruxu2cjd4kumymqm4';
// const streamId = '2c61917e-4f05-449a-ab7d-1b3c85f78993';

export const AssetDemoPlayer = () => {
  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    console.log(ref.duration);
  }, []);

  return (
    <>
      <Player
        src={playbackId}
        // src={'/audio-example.mp3'}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: 'https://lens.infura-ipfs.io/',
        }}
        loop
        // autoPlay
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
