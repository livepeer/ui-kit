export const getMetricsReportingPOSTUrl = async (opts: {
  playbackUrl: string;
}): Promise<string | null> => {
  // And the POST URL should be:
  // https://mdw-staging-staging-catalyst-0.livepeer.monster/metrics/{playbackId}
  const resolvedReportingUrl = await getMetricsReportingUrl({
    playbackUrl: opts.playbackUrl,
    path: "/analytics/log",
  });

  if (!resolvedReportingUrl) {
    return null;
  }

  return resolvedReportingUrl?.toString?.() ?? null;
};

export const getMetricsReportingWebsocketUrl = async (opts: {
  playbackId: string | null;
  playbackUrl: string;
  sessionToken: string | null;
}): Promise<string | null> => {
  if (!opts.playbackId) {
    return null;
  }

  // The websocket URL should be:
  // wss://mdw-staging-staging-catalyst-0.livepeer.monster/json_video+{playbackId}.js?tkn=adb42a8f47438
  const resolvedReportingUrl = await getMetricsReportingUrl({
    playbackUrl: opts.playbackUrl,
    path: `/json_video+${opts.playbackId}.js`,
  });

  if (!resolvedReportingUrl) {
    return null;
  }

  resolvedReportingUrl.protocol = "wss:";

  if (resolvedReportingUrl && opts.sessionToken) {
    resolvedReportingUrl.searchParams.set("tkn", opts.sessionToken);
  }

  return resolvedReportingUrl?.toString?.() ?? null;
};

const LP_DOMAINS = ["livepeer", "livepeercdn", "lp-playback"];

// Gets the metrics reporting URL from a playback ID and a playback domain
const getMetricsReportingUrl = async ({
  playbackUrl,
  path,
}: {
  playbackUrl: string;
  path: `/${string}`;
}) => {
  try {
    // This is either:
    // HLS: https://mdw-staging-staging-catalyst-0.livepeer.monster/hls/video+{playbackId}/0_6/index.m3u8
    // WebRTC: https://mdw-staging-staging-catalyst-0.livepeer.monster/webrtc/video+{playbackId}
    // MP4: https://vod-cdn.lp-playback.monster/raw/{id}/catalyst-vod-monster/hls/{playbackId}/270p0.mp4
    //
    // And the URL should be:
    // https://mdw-staging-staging-catalyst-0.livepeer.monster/{path}
    const parsedPlaybackUrl = new URL(playbackUrl);

    const splitHost = parsedPlaybackUrl.host.split(".");
    const includesDomain = LP_DOMAINS.includes(
      splitHost?.[splitHost.length - 2] ?? "",
    );
    const tld = (splitHost?.[splitHost?.length - 1] ?? null) as
      | "com"
      | "studio"
      | "fun"
      | "monster"
      | null;

    // map to known TLDs, with .com => .studio
    const tldMapped =
      tld === "com"
        ? "studio"
        : tld === "studio"
          ? "studio"
          : tld === "fun"
            ? "fun:20443"
            : tld === "monster"
              ? "monster"
              : null;

    // if not a known TLD, then do not return a URL
    if (includesDomain && tldMapped) {
      const isCatalystPlayback = parsedPlaybackUrl.host.includes("catalyst");

      try {
        const getRedirectedUrl = async (): Promise<string | null> => {
          const response = await fetch(
            `https://playback.livepeer.${tldMapped}${path}`,
          );

          // consume response body
          await response.text();

          return response?.url ?? null;
        };

        const finalUrl = isCatalystPlayback
          ? `https://${parsedPlaybackUrl.host}${path}`
          : await getRedirectedUrl();

        const url = finalUrl ? new URL(finalUrl) : null;

        return url ?? null;
      } catch (error) {
        console.log("Could not fetch reporting URL.", error);
      }
    }
  } catch (error) {
    console.error((error as Error)?.message);
    return null;
  }

  return null;
};

const ASSET_URL_PART_VALUE = "hls";
const FLV_URL_PART_VALUE = "flv";
const WEBRTC_URL_PART_VALUE = "webrtc";
const RECORDING_URL_PART_VALUE = "recordings";

export const getPlaybackIdFromSourceUrl = (sourceUrl: string) => {
  const parsedUrl = new URL(sourceUrl);

  const parts = parsedUrl.pathname.split("/");

  const includesAssetUrl = parts.includes(ASSET_URL_PART_VALUE);
  const includesWebRtcUrl = parts.includes(WEBRTC_URL_PART_VALUE);
  const includesFlvUrl = parts.includes(FLV_URL_PART_VALUE);
  const includesRecording = parts.includes(RECORDING_URL_PART_VALUE);

  // Check if the url is valid
  const playbackId =
    includesWebRtcUrl || includesFlvUrl
      ? parts?.[(parts?.length ?? 0) - 1]
      : includesRecording || includesAssetUrl
        ? (parts?.[(parts?.length ?? 0) - 2] ?? null)
        : null;

  if (playbackId?.includes("+")) {
    const split = playbackId.split("+")?.[1];

    if (split) {
      return split;
    }
  }

  return playbackId ?? null;
};
