import BroadcastPage from './BroadcastPage';

type SearchParams = { [key: string]: string | string[] | undefined };

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

// Once this issue is fixed, this can be removed
// https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: SearchParams;
  params: { key?: string };
}) {
  const query = toStringValues(searchParams);

  const { objectFit = 'contain' } = query;

  return params?.key ? (
    <BroadcastPage
      streamKey={params.key}
      objectFit={objectFit === 'contain' ? 'contain' : 'cover'}
    />
  ) : (
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
      }}
    >
      <span>
        No stream key found. Please check that the URL contains a stream key and
        try again.
      </span>
    </div>
  );
}
