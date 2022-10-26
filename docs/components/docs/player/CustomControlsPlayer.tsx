import {
  ControlsContainer,
  PictureInPictureButton,
  PlayButton,
  Poster,
  Progress,
  TimeDisplay,
  Title,
  Volume,
} from '@livepeer/react';

import Image from 'next/image';

import blenderPoster from '../../../public/images/blender-poster-2.png';
import { DocsDemoPlayer } from './DocsDemoPlayer';

const PosterImage = () => {
  return <Image src={blenderPoster} layout="fill" objectFit="cover" />;
};

const title = 'Agent 327: Operation Barbershop';

export const CustomControlsPlayer = () => {
  return (
    <DocsDemoPlayer
      title={title}
      playbackId="bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy"
    >
      <ControlsContainer
        poster={<Poster content={<PosterImage />} title={title} />}
        top={<Title content={title} />}
        middle={<Progress />}
        left={
          <>
            <PlayButton />
            <Volume showSlider={false} />
            <TimeDisplay />
          </>
        }
        right={<PictureInPictureButton />}
      />
    </DocsDemoPlayer>
  );
};
