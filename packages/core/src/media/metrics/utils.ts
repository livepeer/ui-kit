import fetch from 'cross-fetch';

const LP_DOMAINS = ['livepeer', 'livepeercdn', 'lp-playback'];

// Finds the metrics reporting URL from a playback ID and a playback domain
export const getMetricsReportingUrl = async (
  playbackId: string | null,
  playbackDomain: string,
  sessionToken?: string | null,
): Promise<string | null> => {
  try {
    const parsedUrl = new URL(playbackDomain);

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
