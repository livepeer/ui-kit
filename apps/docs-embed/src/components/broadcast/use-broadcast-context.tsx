"use client";

import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { useBroadcastContext, useStore } from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { CSSProperties } from "react";
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

      <CurrentSource
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
        }}
      />

      <Broadcast.EnabledTrigger
        style={{
          position: "absolute",
          right: 20,
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

function CurrentSource({
  style,
  __scopeBroadcast,
}: Broadcast.BroadcastScopedProps<{ style?: CSSProperties }>) {
  const context = useBroadcastContext("CurrentSource", __scopeBroadcast);

  const { status } = useStore(context.store, ({ status }) => ({
    status,
  }));

  return status ? (
    <div style={style}>
      <span>
        Broadcast status:{" "}
        <span
          style={{
            color: "#ffffffe2",
          }}
        >
          {status}
        </span>
      </span>
    </div>
  ) : null;
}
