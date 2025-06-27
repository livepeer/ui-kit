"use client";

import { PictureInPictureIcon } from "@livepeer/react/assets";
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
        <Broadcast.PictureInPictureTrigger
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 25,
            height: 25,
          }}
        >
          <PictureInPictureIcon />
        </Broadcast.PictureInPictureTrigger>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};
