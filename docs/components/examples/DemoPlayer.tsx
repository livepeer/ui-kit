import { Player } from '@livepeer/react';
import Image from 'next/image';
import * as React from 'react';

const playbackId = '6d7el73r1y12chxr'; // 'a4e8o6mykgkvtxav';
const poster = '/images/blender-poster.png';

const PosterImage = () => {
  return <Image src={poster} layout="fill" objectFit="cover" priority />;
};

export const DemoPlayer = () => {
  return (
    <Player
      title="Agent 327: Operation Barbershop"
      playbackId={playbackId}
      // src={
      //   //    'https://livepeercdn.com/recordings/bd600224-d93a-4ddc-a6ac-2d71e3c36768/index.m3u8'
      //   'https://file-examples.com/storage/fe651bd80a632c9aa9a0f1d/2017/11/file_example_MP3_1MG.mp3'
      // }

      poster={<PosterImage />}
      // muted={false}
      controls={{
        hotkeys: true,
        autohide: 3000,
      }}
      theme={{
        radii: { containerBorderRadius: '30px' },
        sizes: { containerWidth: '600px', containerHeight: '400px' },
        space: {
          controlsTopMarginX: '20px',
          controlsTopMarginY: '15px',
          controlsBottomMarginX: '15px',
          controlsBottomMarginY: '10px',
        },
      }}
    />
  );
};
