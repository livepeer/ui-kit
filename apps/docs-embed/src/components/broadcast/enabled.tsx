"use client";

import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
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

      <Broadcast.EnabledTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.EnabledIndicator asChild matcher={false}>
          <EnableVideoIcon />
        </Broadcast.EnabledIndicator>
        <Broadcast.EnabledIndicator asChild>
          <StopIcon />
        </Broadcast.EnabledIndicator>
      </Broadcast.EnabledTrigger>
    </Broadcast.Root>
  );
};
