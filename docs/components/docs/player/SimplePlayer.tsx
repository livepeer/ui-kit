import { Player } from '@livepeer/react';
import Image from 'next/image';

import blenderPoster from '../../../public/images/blender-poster.png';

const PosterImage = () => {
  return (
    <Image
      src={blenderPoster}
      layout="fill"
      objectFit="cover"
      placeholder="blur"
      priority
    />
  );
};

export const SimplePlayer = () => {
  return (
    <Player
      title="Agent 327: Operation Barbershop"
      playbackId="bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy"
      poster={<PosterImage />}
      showPipButton
    />
  );
};
