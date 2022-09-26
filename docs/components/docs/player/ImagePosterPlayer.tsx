import Image from 'next/image';

import blenderPoster from '../../../public/images/blender-poster.png';

import { DocsDemoPlayer } from './DocsDemoPlayer';

const PosterImage = () => {
  return (
    <Image
      src={blenderPoster}
      layout="fill"
      objectFit="cover"
      placeholder="blur"
    />
  );
};

export const ImagePosterPlayer = () => {
  return (
    <DocsDemoPlayer
      title="Agent 327: Operation Barbershop"
      playbackId="bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy"
      poster={<PosterImage />}
    />
  );
};
