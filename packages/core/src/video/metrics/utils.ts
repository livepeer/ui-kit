// Temporarily hardcoded catalyst node, in production we need to point to .studio
const METRICS_REPORTING_BASE_URL = 'wss://nyc-canary-catalyst-0.livepeer.fun';

const PLAYLIST_NAME = 'index.m3u8';
const ASSET_URL_PART_VALUE = 'hls';
const RECORDING_URL_PART_VALUE = 'recordings';

// Example url the playback id needs to be found in
// https://livepeercdn.com/hls/<playback-id>/index.m3u8
// https://livepeercdn.com/recordings/<playback-id>/index.m3u8
function playbackIdFromPlaybackUrl(url: string): string | undefined {
  const parts = url.split('/');
  const playlistPartIndex = parts.indexOf(PLAYLIST_NAME);
  const assetPartIndex = parts.indexOf(ASSET_URL_PART_VALUE);
  const recordingPartIndex = parts.indexOf(RECORDING_URL_PART_VALUE);

  // Check if the url is valid
  return (assetPartIndex !== -1 || recordingPartIndex !== -1) &&
    playlistPartIndex !== -1
    ? parts[playlistPartIndex - 1]
    : undefined;
}

export function createMetricsReportingUrl(src: string): string | undefined {
  const videoName = playbackIdFromPlaybackUrl(src);
  return videoName
    ? `${METRICS_REPORTING_BASE_URL}/json_video+${videoName}.js`
    : undefined;
}
