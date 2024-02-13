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

        <Broadcast.LoadingIndicator
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          Loading...
        </Broadcast.LoadingIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
