import {
  ClipLength,
  VideoTrackSelector,
  createClient,
} from '@livepeer/core-web';
import { studioProvider } from '@livepeer/core-web/providers/studio';
import { cache } from 'react';

import PlayerPage from './PlayerPage';

export const runtime = 'edge';

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

const { provider } = createClient({
  provider: studioProvider({
    // since this only executes on the server, we can use the PRIVATE_STUDIO_API_KEY,
    // which is a non-CORS enabled API key
    apiKey: process.env.PRIVATE_STUDIO_API_KEY ?? '',
    baseUrl:
      process.env.NEXT_PUBLIC_STUDIO_BASE_URL ?? 'https://livepeer.studio/api',
    ...{ origin: `https://lvpr.tv` },
  }),
});

const fetchPlaybackInfo = cache(async (playbackId: string) => {
  let attempts = 0;

  while (attempts < 3) {
    try {
      const playbackInfo = await provider.getPlaybackInfo({ playbackId });
      return playbackInfo;
    } catch (e) {
      console.error(e);
      attempts++;
      if (attempts >= 3) {
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)); // Jitter up to 1 second
    }
  }
});

const blacklistedPlaybackIds = [
  '052cnzsasax9c10b',
  '0b6a2wuaxm56yhkr',
  '1bcd83gg4ang03l8',
  '2289jf6f37kq3put',
  '2ef11errf17as0df',
  '33d25dz3mqilw1lp',
  '9cfeeodtu023cb91',
  'a12bmexn0h5td3kh',
  'b0739nzrqm6m8k1k',
  'c00a95tv3rysf9ji',
  'c0967lxltr0zkftj',
  'cbcbvq7hgf5vwti2',
  'cc92intolqvyf117',
  'd01cpugvvx04448x',
  'd7a07saeijthkqqk',
  'f355shnx2w9xkhxo',
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
    loop,
    lowLatency,
    objectFit = 'contain',
    constant,
    clipLength,
    jwt,
    videoTrackSelector,
  } = query;

  const playbackId = !url && searchParams?.v ? String(searchParams.v) : null;

  const isBlacklistedPlaybackId = playbackId
    ? blacklistedPlaybackIds.includes(playbackId)
    : false;

  // fetch the playback info from livepeer
  const playbackInfo =
    playbackId && !isBlacklistedPlaybackId
      ? await fetchPlaybackInfo(playbackId)
      : null;

  return (
    <PlayerPage
      src={!playbackInfo ? url : null}
      playbackInfo={playbackInfo ? playbackInfo : null}
      muted={isTrue(muted)}
      autoPlay={isTrue(autoplay)}
      webrtcConfig={{
        constant: isTrue(constant),
        videoTrackSelector: videoTrackSelector as VideoTrackSelector,
      }}
      jwt={jwt}
      clipLength={clipLength ? (Number(clipLength) as ClipLength) : undefined}
      loop={isTrue(loop)}
      objectFit={objectFit === 'contain' ? 'contain' : 'cover'}
      lowLatency={
        isFalse(lowLatency) ? false : isForce(lowLatency) ? 'force' : true
      }
    />
  );
}
