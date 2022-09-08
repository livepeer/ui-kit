// Temporarily hardcoded catalyst node, in production we need to point to .studio
const METRICS_REPORTING_BASE_URL = 'wss://playback.livepeer.fun';

function videoNameFromPlaybackUrl(url: string): string | undefined {
  const filename: string[] = url.split('/');
  const videoName = filename[filename.length - 2];
  return videoName ? videoName.split('.')[0] : undefined;
}

export function createMetricsReportingUrl(src: string): string | undefined {
  const videoName = videoNameFromPlaybackUrl(src);
  return videoName
    ? `${METRICS_REPORTING_BASE_URL}/json_video+${videoName}.js`
    : undefined;
}
