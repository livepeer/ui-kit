"use client";

import {
  StartScreenshareIcon,
  StopScreenshareIcon,
} from "@livepeer/react/assets";
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

      <Broadcast.ScreenshareTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.ScreenshareIndicator asChild matcher={false}>
          <StartScreenshareIcon />
        </Broadcast.ScreenshareIndicator>
        <Broadcast.ScreenshareIndicator asChild>
          <StopScreenshareIcon />
        </Broadcast.ScreenshareIndicator>
      </Broadcast.ScreenshareTrigger>
    </Broadcast.Root>
  );
};
