import CountdownPage from './CountdownPage';
import PlayerPage from './PlayerPage';
import { fetchPlaybackInfo } from '../utils/client';

type SearchParams = { [key: string]: string | string[] | undefined };

const isTrue = (b: string) =>
  b === '' || b === '1' || b?.toLowerCase() === 'true';

const isFalse = (b: string) => b?.toLowerCase() === 'false';

const isForce = (b: string) => b?.toLowerCase() === 'force';

function toStringValues(obj?: SearchParams) {
  if (obj) {
    const strObj: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        strObj[key] = value.toString();
      }
    }
    return strObj;
  }
  return {};
}

// Known URL parameters to use in reconstructing the poster URL
const KNOWN_PARAMS = [
  'loop',
  'lowLatency',
  'objectFit',
  'poster',
  'countdown',
  'v',
  'autoplay',
  'muted',
];

// Once this issue is fixed, this can be removed
// https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const url = String(searchParams?.url ?? '');

  const query = toStringValues(searchParams);
  let { autoplay, muted } = query;

  if (autoplay === undefined && (muted === undefined || isTrue(muted))) {
    autoplay = muted = '1';
  }

  const {
    v,
    loop,
    lowLatency,
    objectFit = 'contain',
    poster,
    countdown,
  } = query;

  // Fetch playback info if necessary
  const playbackInfo =
    !url && searchParams?.v
      ? await fetchPlaybackInfo(String(searchParams.v))
      : null;

  // Reconstruct the poster URL based on the query
  let reconstructedPoster = poster || '';
  for (const [key, value] of Object.entries(query)) {
    if (!KNOWN_PARAMS.includes(key)) {
      reconstructedPoster += `&${key}=${value}`;
    }
  }

  return (
    <>
      {poster || countdown ? (
        <CountdownPage
          poster={reconstructedPoster}
          countdown={Number(countdown)}
          id={v}
          src={!playbackInfo ? url : null}
          playbackInfo={playbackInfo ? playbackInfo : null}
          muted={isTrue(muted)}
          autoPlay={isTrue(autoplay)}
          loop={isTrue(loop)}
          objectFit={objectFit === 'contain' ? 'contain' : 'cover'}
          lowLatency={
            isFalse(lowLatency) ? false : isForce(lowLatency) ? 'force' : true
          }
        />
      ) : (
        <PlayerPage
          src={!playbackInfo ? url : null}
          playbackInfo={playbackInfo ? playbackInfo : null}
          muted={isTrue(muted)}
          autoPlay={isTrue(autoplay)}
          loop={isTrue(loop)}
          objectFit={objectFit === 'contain' ? 'contain' : 'cover'}
          lowLatency={
            isFalse(lowLatency) ? false : isForce(lowLatency) ? 'force' : true
          }
        />
      )}
    </>
  );
}
