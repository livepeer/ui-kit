import { prefetchPlayer } from '@livepeer/react';
import type { GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Player } from '../../components/player/Player';

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
  const dehydratedState = await prefetchPlayer(
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

  const playbackId = query.id ? String(query.id) : null;

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
      {playbackId ? (
        <Player playbackId={playbackId} />
      ) : (
        'No playback ID provided!'
      )}
    </div>
  );
};

export default PlayerPage;
