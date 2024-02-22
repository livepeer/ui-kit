import { describe, expect, it } from "vitest";

import {
  getMetricsReportingUrl,
  getPlaybackIdFromSourceUrl,
} from "./metrics-utils";

describe("getMetricsReportingUrl", () => {
  describe("asset url", () => {
    it("given a valid url then it should return a reporting url", async () => {
      const sourceUrl =
        "https://livepeercdn.com/hls/172159gos7h0pq17/index.m3u8";

      const reportingUrl = await getMetricsReportingUrl(
        "172159gos7h0pq17",
        sourceUrl,
      );

      expect(reportingUrl).toContain(
        ".lp-playback.studio/json_video+172159gos7h0pq17.js",
      );
    });

    it("given a valid metrics url then it should return a reporting url", async () => {
      const sourceUrl =
        "https://asset-cdn.lp-playback.studio/hls/172159gos7h0pq17/index.m3u8";

      const reportingUrl = await getMetricsReportingUrl(
        "172159gos7h0pq17",
        sourceUrl,
      );

      expect(reportingUrl).toContain(
        ".lp-playback.studio/json_video+172159gos7h0pq17.js",
      );
    });

    it("given invalid urls then it should not return a reporting urls", async () => {
      const sourceUrls = [
        "https://livecdn.com/dash/172159gos7h0pq17/index.m3u8",
        "https://livecdn.com/hls/172159gos7h0pq17/master.m3u8",
      ];

      const reportingUrls = await Promise.all(
        sourceUrls.map(async (url) => getMetricsReportingUrl("test", url)),
      );

      expect(reportingUrls).toEqual([null, null]);
    });
  });

  describe("recording url", () => {
    it("given a valid url then it should return a reporting url", async () => {
      const sourceUrl =
        "https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8";

      const reportingUrl = await getMetricsReportingUrl(
        "c34af47b-bbf2-40ed-ad2d-77abd43860c9",
        sourceUrl,
      );

      expect(reportingUrl).toContain(
        ".lp-playback.studio/json_video+c34af47b-bbf2-40ed-ad2d-77abd43860c9.js",
      );
    });

    it("given invalid urls then it should not return a reporting urls", async () => {
      const sourceUrls = [
        {
          playbackId: "someid",
          url: "https://livecdn.com/static/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8",
        },
        {
          playbackId: "someid",
          url: "https://livecdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/master.m3u8",
        },
      ];

      const reportingUrls = await Promise.all(
        sourceUrls.map(
          async ({ playbackId, url }) =>
            await getMetricsReportingUrl(playbackId, url),
        ),
      );

      expect(reportingUrls).toEqual([null, null]);
    });
  });
});

describe("getPlaybackIdFromSourceUrl", () => {
  it("given a valid url then it should return a reporting url", async () => {
    const sourceUrl =
      "https://livepeercdn.studio/hls/172159gos7h0pq17/index.m3u8";

    const playbackId = await getPlaybackIdFromSourceUrl(sourceUrl);

    expect(playbackId).toEqual("172159gos7h0pq17");
  });

  it("given a valid webrtc url then it should return a reporting url", async () => {
    const sourceUrl = "https://livepeercdn.studio/webrtc/172159gos7h0pq17";

    const playbackId = await getPlaybackIdFromSourceUrl(sourceUrl);

    expect(playbackId).toEqual("172159gos7h0pq17");
  });

  it("given a valid flv url then it should return a reporting url", async () => {
    const sourceUrl = "https://livepeercdn.studio/flv/172159gos7h0pq17";

    const playbackId = await getPlaybackIdFromSourceUrl(sourceUrl);

    expect(playbackId).toEqual("172159gos7h0pq17");
  });

  it("given a valid pinned playback url then it should return a reporting url", async () => {
    const sourceUrl =
      "https://sin-prod-catalyst-2.lp-playback.studio/webrtc/video+172159gos7h0pq17";

    const playbackId = await getPlaybackIdFromSourceUrl(sourceUrl);

    expect(playbackId).toEqual("172159gos7h0pq17");
  });

  it("given invalid urls then it should not return a playback ID", async () => {
    const sourceUrls = [
      "https://livecdn.com/static/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8",
      "https://livecdn.com/another-url/c34af47b-bbf2-40ed-ad2d-77abd43860c9/master.m3u8",
    ];

    const reportingUrls = await Promise.all(
      sourceUrls.map(async (url) => await getPlaybackIdFromSourceUrl(url)),
    );

    expect(reportingUrls).toEqual([null, null]);
  });
});
