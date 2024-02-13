"use client";

import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />

        <Broadcast.Controls
          style={{
            padding: 20,
          }}
          autoHide={5000}
        >
          Auto-hidden controls container for broadcast
        </Broadcast.Controls>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
