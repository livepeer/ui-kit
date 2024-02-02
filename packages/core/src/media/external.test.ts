import { describe, expect, it } from "vitest";

import { cloudflareSources, livepeerSources } from "../../test/utils";
import { getIngest, getSrc } from "./external";

describe("getSrc", () => {
  describe("string", () => {
    it("null", async () => {
      const src = await getSrc(null);

      expect(src).toBeNull();
    });
    it("undefined", async () => {
      const src = await getSrc(undefined);

      expect(src).toBeNull();
    });
    it("empty string", async () => {
      const src = await getSrc("");

      expect(src).toBeNull();
    });
    it("incorrect string", async () => {
      const src = await getSrc("blah");

      expect(src).toBeNull();
    });
    it("no protocol", async () => {
      const src = await getSrc("http://akljsdf.com");

      expect(src).toBeNull();
    });
    it("no protocol 2", async () => {
      const src = await getSrc("http://akljsdf.com/no/protocol");

      expect(src).toBeNull();
    });
    it("string url", async () => {
      const src = await getSrc("https://playback.com/path/b236bde3/480p0.mp4");

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/480p0.mp4",
            "type": "video",
            "width": null,
          },
        ]
      `);
    });
    it("array of string urls", async () => {
      const src = await getSrc([
        "https://playback.com/path/b236bde3/1.mp4",
        "https://playback.com/path/b236bde3/2.mp4",
        "https://playback.com/path/b236bde3/3.mp4",
      ]);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/1.mp4",
            "type": "video",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/2.mp4",
            "type": "video",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/3.mp4",
            "type": "video",
            "width": null,
          },
        ]
      `);
    });
    it("array of string urls", async () => {
      const src = await getSrc([
        "https://playback.com/path/b236bde3/1.mp4",
        "https://playback.com/path/b236bde3/2.mp4",
        "https://playback.com/path/b236bde3/3.mp4",
      ]);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/1.mp4",
            "type": "video",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/2.mp4",
            "type": "video",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/3.mp4",
            "type": "video",
            "width": null,
          },
        ]
      `);
    });
    it("array of string urls and poster", async () => {
      const src = await getSrc([
        "https://playback.com/path/b236bde3/1.mp4",
        "https://playback.com/path/b236bde3/3.jpg",
        "https://playback.com/path/b236bde3/3.vtt",
      ]);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/mp4",
            "src": "https://playback.com/path/b236bde3/1.mp4",
            "type": "video",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://playback.com/path/b236bde3/3.jpg",
            "type": "image",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://playback.com/path/b236bde3/3.vtt",
            "type": "vtt",
            "width": null,
          },
        ]
      `);
    });
    it("hls", async () => {
      const src = await getSrc("https://playback.com/path/b236bde3/1.m3u8");

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://playback.com/path/b236bde3/1.m3u8",
            "type": "hls",
            "width": null,
          },
        ]
      `);
    });
    it("webrtc", async () => {
      const src = await getSrc("https://playback.com/path/webrtc/somesecret");

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://playback.com/path/webrtc/somesecret",
            "type": "webrtc",
            "width": null,
          },
        ]
      `);
    });
    it("webrtc complex", async () => {
      const src = await getSrc(
        "https://playback.com/path/path2/somesecret/webrtc",
      );

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://playback.com/path/path2/somesecret/webrtc",
            "type": "webrtc",
            "width": null,
          },
        ]
      `);
    });
    it("webrtc uppercase", async () => {
      const src = await getSrc([
        "https://playback.com/path/webRTC/somesecret",
        "https://playback.com/path/WebRTC/somesecret",
      ]);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://playback.com/path/webRTC/somesecret",
            "type": "webrtc",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://playback.com/path/WebRTC/somesecret",
            "type": "webrtc",
            "width": null,
          },
        ]
      `);
    });
    it("webrtc array", async () => {
      const src = await getSrc([
        "https://playback.com/path/webrtc/somesecret",
        "https://playback.com/path/b236bde3/3.jpg",
        "https://playback.com/path/b236bde3/3.vtt",
      ]);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://playback.com/path/webrtc/somesecret",
            "type": "webrtc",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://playback.com/path/b236bde3/3.jpg",
            "type": "image",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://playback.com/path/b236bde3/3.vtt",
            "type": "vtt",
            "width": null,
          },
        ]
      `);
    });
  });

  describe("livepeer", () => {
    it("shortAssetMultipleMP4", async () => {
      const src = await getSrc(livepeerSources.shortAssetMultipleMP4);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": 2160,
            "mime": "video/mp4",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static2160p0.mp4",
            "type": "video",
            "width": 3840,
          },
          {
            "height": 720,
            "mime": "video/mp4",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static720p0.mp4",
            "type": "video",
            "width": 1280,
          },
          {
            "height": 360,
            "mime": "video/mp4",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/static360p0.mp4",
            "type": "video",
            "width": 640,
          },
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/cbddoks280eyu0x7/index.m3u8",
            "type": "hls",
            "width": null,
          },
        ]
      `);
    });
    it("shortAsset", async () => {
      const src = await getSrc(livepeerSources.shortAsset);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": 480,
            "mime": "video/mp4",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/480p0.mp4",
            "type": "video",
            "width": 640,
          },
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/index.m3u8",
            "type": "hls",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/b236bde3/thumbnails/thumbnails.vtt",
            "type": "vtt",
            "width": null,
          },
        ]
      `);
    });
    it("longAsset", async () => {
      const src = await getSrc(livepeerSources.longAsset);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/catalyst-vod-com/hls/be1e4f7z0yfw88wd/index.m3u8",
            "type": "hls",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://vod-cdn.lp-playback.studio/raw/00ks6nunl/be1e4f7z0yfw88wd/thumbnails/thumbnails.vtt",
            "type": "vtt",
            "width": null,
          },
        ]
      `);
    });
    it("live", async () => {
      const src = await getSrc(livepeerSources.live);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://livepeercdn.studio/hls/b7f3rvvf5rnzzy29/index.m3u8",
            "type": "hls",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://livepeercdn.studio/webrtc/b7f3rvvf5rnzzy29",
            "type": "webrtc",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://link.storjshare.io/raw/00ks6nunl/hls/f7z0yfw88wd/0yfw88wd/source/latest.jpg",
            "type": "image",
            "width": null,
          },
        ]
      `);
    });
    it("live", async () => {
      const src = await getSrc(livepeerSources.live.meta.source);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://livepeercdn.studio/hls/b7f3rvvf5rnzzy29/index.m3u8",
            "type": "hls",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://livepeercdn.studio/webrtc/b7f3rvvf5rnzzy29",
            "type": "webrtc",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://link.storjshare.io/raw/00ks6nunl/hls/f7z0yfw88wd/0yfw88wd/source/latest.jpg",
            "type": "image",
            "width": null,
          },
        ]
      `);
    });

    it("live source", async () => {
      const src = await getSrc(livepeerSources.live.meta.source);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "application/vnd.apple.mpegurl",
            "src": "https://livepeercdn.studio/hls/b7f3rvvf5rnzzy29/index.m3u8",
            "type": "hls",
            "width": null,
          },
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://livepeercdn.studio/webrtc/b7f3rvvf5rnzzy29",
            "type": "webrtc",
            "width": null,
          },
          {
            "height": null,
            "mime": null,
            "src": "https://link.storjshare.io/raw/00ks6nunl/hls/f7z0yfw88wd/0yfw88wd/source/latest.jpg",
            "type": "image",
            "width": null,
          },
        ]
      `);
    });
  });

  describe("cloudflare", () => {
    it("webrtc", async () => {
      const src = await getSrc(cloudflareSources.webrtc);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/play",
            "type": "webrtc",
            "width": null,
          },
        ]
      `);
    });
    it("webrtc", async () => {
      const src = await getSrc(cloudflareSources.webrtc.webRTCPlayback);

      expect(src).toMatchInlineSnapshot(`
        [
          {
            "height": null,
            "mime": "video/h264",
            "src": "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/play",
            "type": "webrtc",
            "width": null,
          },
        ]
      `);
    });
  });
});

describe("getIngest", () => {
  describe("url", () => {
    it("null", async () => {
      const ingest = await getIngest(null);

      expect(ingest).toBeNull();
    });
    it("undefined", async () => {
      const ingest = await getIngest(undefined);

      expect(ingest).toBeNull();
    });
    it("no base url", async () => {
      const ingest = await getIngest("1234", {
        baseUrl: null,
      });

      expect(ingest).toBeNull();
    });
    it("webrtc url", async () => {
      const ingest = await getIngest("https://playback.com/webrtc/b236bde3");

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.com/webrtc/b236bde3"`,
      );
    });
    it("url", async () => {
      const ingest = await getIngest("https://playback.com/path/b236bde3");

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.com/path/b236bde3"`,
      );
    });
    it("url w/ no base", async () => {
      const ingest = await getIngest("https://playback.com/webrtc/b236bde3", {
        baseUrl: null,
      });

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.com/webrtc/b236bde3"`,
      );
    });
  });
  describe("object", () => {
    it("empty", async () => {
      const ingest = await getIngest({});

      expect(ingest).toBeNull();
    });
    it("invalid", async () => {
      const ingest = await getIngest({ somekey: "abc" } as object);

      expect(ingest).toBeNull();
    });
    it("stream key", async () => {
      const ingest = await getIngest({ streamKey: "abcd123" });

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.livepeer.studio/webrtc/abcd123"`,
      );
    });
    it("livepeer", async () => {
      const ingest = await getIngest(livepeerSources.streamIngest);

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.livepeer.studio/webrtc/30eb-d013-5fc3-1234"`,
      );
    });
    it("livepeer stream key", async () => {
      const ingest = await getIngest(livepeerSources.streamIngest.streamKey);

      expect(ingest).toMatchInlineSnapshot(
        `"https://playback.livepeer.studio/webrtc/30eb-d013-5fc3-1234"`,
      );
    });
    it("cloudflare", async () => {
      const ingest = await getIngest(cloudflareSources.webrtc);

      expect(ingest).toMatchInlineSnapshot(
        `"https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/publish"`,
      );
    });
    it("cloudflare", async () => {
      const ingest = await getIngest(cloudflareSources.webrtc.webRTC);

      expect(ingest).toMatchInlineSnapshot(
        `"https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/publish"`,
      );
    });
  });
});
