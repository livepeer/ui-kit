import { createReadStream, type ReadStream, statSync } from "node:fs";
import { resolve } from "node:path";

export function getSampleVideo(): { file: ReadStream; uploadSize: number } {
  const sampleFilePath = resolve(__dirname, "./sample.mp4");

  const { size } = statSync(sampleFilePath);
  const file = createReadStream(sampleFilePath);
  return { file, uploadSize: size };
}

export const livepeerSources = {
  shortAsset: {
    type: "vod",
    meta: {
      playbackPolicy: null,
      source: [
        {
          hrn: "MP4",
          type: "html5/video/mp4",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/480p0.mp4",
          size: 1283118,
          width: 640,
          height: 480,
          bitrate: 223844,
        },
        {
          hrn: "HLS (TS)",
          type: "html5/application/vnd.apple.mpegurl",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/index.m3u8",
        },
        {
          hrn: "Thumbnails",
          type: "text/vtt",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/thumbnails/thumbnails.vtt",
        },
      ],
    },
  },
  shortAssetMultipleMP4: {
    type: "vod",
    meta: {
      playbackPolicy: null,
      source: [
        {
          hrn: "MP4",
          type: "html5/video/mp4",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static2160p0.mp4",
          size: 46098058,
          width: 3840,
          height: 2160,
          bitrate: 41801348,
        },
        {
          hrn: "MP4",
          type: "html5/video/mp4",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static720p0.mp4",
          size: 4522916,
          width: 1280,
          height: 720,
          bitrate: 4005767,
        },
        {
          hrn: "MP4",
          type: "html5/video/mp4",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static360p0.mp4",
          size: 1207421,
          width: 640,
          height: 360,
          bitrate: 991680,
        },
        {
          hrn: "HLS (TS)",
          type: "html5/application/vnd.apple.mpegurl",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/index.m3u8",
        },
      ],
    },
  },
  longAsset: {
    type: "vod",
    meta: {
      playbackPolicy: null,
      source: [
        {
          hrn: "HLS (TS)",
          type: "html5/application/vnd.apple.mpegurl",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/be1e4f7z0yfw88wd/index.m3u8",
        },
        {
          hrn: "Thumbnails",
          type: "text/vtt",
          url: "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/be1e4f7z0yfw88wd/thumbnails/thumbnails.vtt",
        },
      ],
    },
  },
  live: {
    type: "live",
    meta: {
      live: 0,
      source: [
        {
          hrn: "HLS (TS)",
          type: "html5/application/vnd.apple.mpegurl",
          url: "https://livepeercdn.studio/hls/b7f3rvvf5rnzzy29/index.m3u8",
        },
        {
          hrn: "WebRTC (H264)",
          type: "html5/video/h264",
          url: "https://livepeercdn.studio/webrtc/b7f3rvvf5rnzzy29",
        },
        {
          hrn: "Thumbnail (JPEG)",
          type: "image/jpeg",
          url: "https://link.storjshare.io/raw/00ks6nunl/hls/f7z0yfw88wd/0yfw88wd/source/latest.jpg",
        },
      ],
    },
  },
  streamIngest: {
    lastSeen: 1706828976041,
    isActive: false,
    record: false,
    suspended: false,
    sourceSegments: 642,
    transcodedSegments: 2568,
    sourceSegmentsDuration: 1282.8329999999983,
    transcodedSegmentsDuration: 5131.332000000012,
    sourceBytes: 148475444,
    transcodedBytes: 604249108,
    kind: "stream",
    name: "test",
    issues: null,
    region: "lax",
    profiles: [
      {
        fps: 0,
        name: "240p0",
        width: 426,
        height: 240,
        bitrate: 250000,
      },
      {
        fps: 0,
        name: "360p0",
        width: 640,
        height: 360,
        bitrate: 800000,
      },
      {
        fps: 0,
        name: "480p0",
        width: 854,
        height: 480,
        bitrate: 1600000,
      },
      {
        fps: 0,
        name: "720p0",
        width: 1280,
        height: 720,
        bitrate: 3000000,
      },
    ],
    createdAt: 1706800996258,
    isHealthy: true,
    streamKey: "30eb-d013-5fc3-1234",
    ingestRate: 0,
    playbackId: "e30eb07b9e34",
    renditions: {},
    multistream: {
      targets: [],
    },
    outgoingRate: 0,
  },
};

export const cloudflareSources = {
  webrtc: {
    created: "2014-01-02T02:20:00Z",
    deleteRecordingAfterDays: 45,
    meta: {
      name: "test stream 1",
    },
    modified: "2014-01-02T02:20:00Z",
    recording: {
      mode: "off",
      requireSignedURLs: false,
      timeoutSeconds: 0,
    },
    rtmps: {
      streamKey:
        "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
      url: "rtmps://live.cloudflare.com:443/live/",
    },
    rtmpsPlayback: {
      streamKey:
        "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
      url: "rtmps://live.cloudflare.com:443/live/",
    },
    srt: {
      passphrase:
        "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
      streamId: "f256e6ea9341d51eea64c9454659e576",
      url: "srt://live.cloudflare.com:778",
    },
    srtPlayback: {
      passphrase:
        "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
      streamId: "f256e6ea9341d51eea64c9454659e576",
      url: "rtmps://live.cloudflare.com:443/live/",
    },
    status: null,
    uid: "66be4bf738797e01e1fca35a7bdecdcd",
    webRTC: {
      url: "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/publish",
    },
    webRTCPlayback: {
      url: "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/play",
    },
  },
};
