import fetch from 'cross-fetch';

const LP_DOMAINS = ['livepeer', 'livepeercdn', 'lp-playback'];
const ASSET_URL_PART_VALUE = 'hls';
const RECORDING_URL_PART_VALUE = 'recordings';

// Example url the playback id needs to be found in
// https://livepeercdn.com/hls/<playback-id>/index.m3u8
// https://livepeercdn.com/recordings/<playback-id>/index.m3u8
export const getMetricsReportingUrl = async (
  src: string,
  sessionToken?: string | null,
): Promise<string | null> => {
  try {
    const parsedUrl = new URL(src);

    const parts = parsedUrl.pathname.split('/');

    const includesAssetUrl = parts.includes(ASSET_URL_PART_VALUE);
    const includesRecording = parts.includes(RECORDING_URL_PART_VALUE);

    // Check if the url is valid
    const playbackId =
      includesRecording || includesAssetUrl
        ? parts?.[(parts?.length ?? 0) - 2] ?? null
        : null;

    const splitHost = parsedUrl.host.split('.');
    const includesDomain = LP_DOMAINS.includes(
      splitHost?.[splitHost.length - 2] ?? '',
    );
    const tld = (splitHost?.[splitHost?.length - 1] ?? null) as
      | 'com'
      | 'studio'
      | 'fun'
      | 'monster'
      | null;

    // map to known TLDs, with .com => .studio
    const tldMapped =
      tld === 'com'
        ? 'studio'
        : tld === 'studio'
        ? 'studio'
        : tld === 'fun'
        ? 'fun:20443'
        : tld === 'monster'
        ? 'monster'
        : null;

    // if not a known TLD, then do not return a URL
    if (playbackId && includesDomain && tldMapped) {
      try {
        const response = await fetch(
          `https://playback.livepeer.${tldMapped}/json_video+${playbackId}.js`,
        );

        // parse the url which we're redirected to
        const redirectedUrl = response?.url?.replace('https:', 'wss:');

        const url = redirectedUrl ? new URL(redirectedUrl) : null;

        if (url && sessionToken) {
          url.searchParams.set('tkn', sessionToken);
        }

        return url?.toString?.() ?? null;
      } catch (error) {
        console.log(`Could not fetch metrics reporting URL.`, error);
      }
    }
  } catch (error) {
    console.error((error as Error)?.message);
    return null;
  }

  return null;
};
