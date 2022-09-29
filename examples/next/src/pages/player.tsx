import { Player } from '@livepeer/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const isTrue = (b: string) =>
  b === '' || b === '1' || b?.toLowerCase() === 'true';

function toStringValues(obj: Record<string, any>) {
  const strObj: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    strObj[key] = value.toString();
  }
  return strObj;
}

const PlayerPage: NextPage = () => {
  const { query: rawQuery } = useRouter();
  const query = useMemo(() => toStringValues(rawQuery), [rawQuery]);
  const { autoplay = '1', muted = autoplay, loop, v, url } = query;

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
        src={url}
        playbackId={v ?? 'ce4d4q4z1hj08e2s'}
        muted={isTrue(muted)}
        autoPlay={isTrue(autoplay)}
        loop={isTrue(loop)}
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
