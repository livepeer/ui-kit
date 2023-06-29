import { createClient } from 'livepeer';
import { studioProvider } from 'livepeer/providers/studio';
import { cache } from 'react';

import PlayerPage from './PlayerPage';

type SearchParams = { [key: string]: string | string[] | undefined };

const isTrue = (b: string) =>
  b === '' || b === '1' || b?.toLowerCase() === 'true';

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
  try {
    const playbackInfo = await provider.getPlaybackInfo({ playbackId });

    return playbackInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
});

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

  const { loop, lowLatency, objectFit = 'contain' } = query;

  // fetch the playback info from livepeer
  const playbackInfo =
    !url && searchParams?.v
      ? await fetchPlaybackInfo(String(searchParams.v))
      : null;

  return (
    <PlayerPage
      src={!playbackInfo ? url : null}
      playbackInfo={playbackInfo ? playbackInfo : null}
      muted={isTrue(muted)}
      autoPlay={isTrue(autoplay)}
      loop={isTrue(loop)}
      objectFit={objectFit === 'contain' ? 'contain' : 'cover'}
      lowLatency={isTrue(lowLatency)}
    />
  );
}
