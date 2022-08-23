/* eslint-disable @typescript-eslint/no-unused-vars */

// Temporarily hardcoded catalyst node
const METRICS_REPORTING_BASE_URL = 'wss://sao-canary-catalyst-0.livepeer.fun';

function videoNameFromPlaybackUrl(url: string): string | undefined {
  const filename: string[] = url.split('/');
  const videoName = filename[filename.length - 2];
  return videoName ? videoName.split('.')[0] : undefined;
}

export function createMetricsReportingUrl(src: string): string | undefined {
  // TODO: do not merge this
  return 'wss://patchy.ddvtech.com/mist/json_bunny.js';
  // const videoName = videoNameFromPlaybackUrl(src);
  // return videoName
  //   ? `${METRICS_REPORTING_BASE_URL}/json_${videoName}.js`
  //   : undefined;
}

/* eslint-enable @typescript-eslint/no-unused-vars */
