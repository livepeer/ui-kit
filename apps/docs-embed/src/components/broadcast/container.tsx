"use client";

import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root aspectRatio={null} ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        Content in plain div with no aspect ratio
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
