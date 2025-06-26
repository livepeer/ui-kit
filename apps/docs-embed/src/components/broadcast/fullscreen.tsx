"use client";

import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
} from "@livepeer/react/assets";
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
        <Broadcast.FullscreenTrigger
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 25,
            height: 25,
          }}
        >
          <Broadcast.FullscreenIndicator asChild matcher={false}>
            <EnterFullscreenIcon />
          </Broadcast.FullscreenIndicator>
          <Broadcast.FullscreenIndicator asChild>
            <ExitFullscreenIcon />
          </Broadcast.FullscreenIndicator>
        </Broadcast.FullscreenTrigger>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
