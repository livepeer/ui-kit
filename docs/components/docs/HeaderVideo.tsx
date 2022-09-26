import { Player } from '@livepeer/react';
import Image from 'next/image';
import * as React from 'react';

import waterfallsPoster from '../../public/images/waterfalls-poster.png';

const PosterImage = () => {
  return (
    <Image
      src={waterfallsPoster}
      layout="fill"
      objectFit="cover"
      priority
      placeholder="blur"
    />
  );
};

const playbackId =
  'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe';

export function HeaderVideo() {
  return (
    <Player
      title="Waterfalls"
      playbackId={playbackId}
      loop
      autoPlay
      showTitle={false}
      muted
      poster={<PosterImage />}
    />
  );
}
