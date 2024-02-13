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
          onProgress={(e) => {
            // we fake an error here every time there is progress

            setTimeout(() => {
              e.target.dispatchEvent(new Event("error"));
            }, 7000);
          }}
        />

        <Broadcast.ErrorIndicator
          matcher="all"
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          An error occurred. Trying to resume broadcast...
        </Broadcast.ErrorIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
