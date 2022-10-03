import { Player, prefetchPlaybackInfo } from '@livepeer/react';
import type { GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { provider } from '../../utils';

type Path = {
  id: string;
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps = async (props: GetStaticPropsContext<Path>) => {
  const dehydratedState = await prefetchPlaybackInfo(
    { playbackId: props.params?.id },
    { provider },
  );

  return {
    props: {
      dehydratedState,
    },
    revalidate: 600,
  };
};

const PlayerPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <Player
        objectFit="contain"
        playbackId={query.id ? String(query.id) : null}
        muted
        // autoPlay
        theme={{
          radii: {
            containerBorderRadius: '0px',
          },
        }}
      />
    </div>
  );
};

export default PlayerPage;
