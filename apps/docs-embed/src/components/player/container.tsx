"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root aspectRatio={null} src={getSrc(vodSource)}>
      <Player.Container>
        Content in plain div with no aspect ratio
      </Player.Container>
    </Player.Root>
  );
};
