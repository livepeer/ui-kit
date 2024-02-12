"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

const vodSourceWithThumbnail = {
  ...vodSource,
  meta: {
    ...vodSource.meta,
    source: [
      ...vodSource.meta.source,
      {
        hrn: "Thumbnail (JPEG)",
        type: "image/jpeg",
        url: "https://ddz4ak4pa3d19.cloudfront.net/cache/7e/01/7e013b156f34e6210e53c299b2b531f5.jpg",
      },
    ],
  },
};

export default () => {
  return (
    <Player.Root src={getSrc(vodSourceWithThumbnail)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.PlayingIndicator asChild matcher={false}>
        <Player.Poster
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      </Player.PlayingIndicator>
    </Player.Root>
  );
};
