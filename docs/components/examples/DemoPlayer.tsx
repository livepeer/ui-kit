import { Box, Flex } from '@livepeer/design-system';
import { Player } from '@livepeer/react';

import Image from 'next/image';

const playbackId =
  'bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy'; // 'a4e8o6mykgkvtxav';
const poster = '/images/blender-poster.png';

const PosterImage = () => {
  return <Image src={poster} layout="fill" objectFit="cover" priority />;
};

// https://ipfs.livepeer.studio/ipfs/QmPHSco6gGRL9WZTjsYeAvqTJkCTNe4VyCbX5SWYaK4h8L/agent-327.mp4
// https://ipfs.livepeer.studio/ipfs/QmPHSco6gGRL9WZTjsYeAvqTJkCTNe4VyCbX5SWYaK4h8L/audio.mp3

export const DemoPlayer = () => {
  return (
    <>
      <Flex css={{ justifyContent: 'center' }}>
        <Box css={{ width: '500px' }}>
          <Player
            title="Agent 327: Operation Barbershop"
            playbackId={playbackId}
            // src={[
            //   'https://ipfs.livepeer.com/ipfs/bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy?filename=agent-327.mp4',
            // ]}
            autoPlay
            muted
            // aspectRatio="1to1"
            poster={<PosterImage />}
            // muted={false}
            controls={{
              hotkeys: true,
              autohide: 3000,
            }}
            theme={{
              radii: { containerBorderRadius: '30px' },
              space: {
                controlsTopMarginX: '20px',
                controlsTopMarginY: '15px',
                controlsBottomMarginX: '15px',
                controlsBottomMarginY: '10px',
              },
            }}
          />
        </Box>
      </Flex>
    </>
  );
};
