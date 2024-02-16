"use client";

import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
        }}
      >
        <Broadcast.StatusIndicator matcher="idle">
          Idle
        </Broadcast.StatusIndicator>
      </div>
    </Broadcast.Root>
  );
};
