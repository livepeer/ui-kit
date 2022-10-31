import { Player } from '@livepeer/react';

import Image from 'next/image';

const playbackId = '0ff7i28n5klnmwy1';

import blenderPoster from '../../public/images/blender-poster.png';

const PosterImage = () => {
  return (
    <Image
      src={blenderPoster}
      layout="fill"
      objectFit="cover"
      priority
      placeholder="blur"
    />
  );
};

export const DemoPlayer = () => {
  return (
    <Player
      title="Agent 327"
      playbackId={playbackId}
      showPipButton
      showTitle
      aspectRatio="16to9"
      poster={<PosterImage />}
      controls={{
        autohide: 3000,
      }}
      theme={{
        borderStyles: { containerBorderStyle: 'hidden' },
        radii: { containerBorderRadius: '10px' },
      }}
    />
  );
};
